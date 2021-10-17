import React from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Button, Box, Flex, Spinner, useToast } from '@chakra-ui/react'

import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import {
  FieldError,
  MeDocument,
  MeQuery,
  RegisterInput,
  useRegisterMutation,
} from '../generated/graphql'
import { mapFieldErrors } from '../helpers/mapFieldErrors'
import { useCheckAuth } from '../utils/useCheckAuth'

const Register = () => {
  const router = useRouter()
  const { data: authData, loading: authLoading } = useCheckAuth()
  const [registerUser, { data, error, loading: _registerUserLoading }] =
    useRegisterMutation()
  const initialValues: RegisterInput = { username: '', email: '', password: '' }
  const toast = useToast()

  const onRegisterSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>,
  ) => {
    const res = await registerUser({
      variables: {
        registerInput: values,
      },
      update(cache, { data }) {
        if (data?.register.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.register.user,
            },
          })
        }
      },
    })
    if (!res.data?.register.success) {
      setErrors(mapFieldErrors(res.data?.register.errors as FieldError[]))
      return
    }
    toast({
      title: 'Welcome',
      description: 'Registered successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    router.push('/')
  }

  return (
    <>
      {authLoading || (!authLoading && authData?.me) ? (
        <Flex h="100vh" justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      ) : (
        <Wrapper size="small">
          {error && <p>Failed to register. Internal server error</p>}
          {data && data.register.success && <p>Register successfully</p>}
          <Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="username"
                  label="Username"
                  placeholder="Username"
                  type="text"
                />
                <Box mt={4}>
                  <InputField
                    name="email"
                    label="Email"
                    placeholder="Email"
                    type="text"
                  />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                  />
                </Box>
                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Register
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      )}
    </>
  )
}

export default Register
