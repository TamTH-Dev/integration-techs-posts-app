import React from 'react'
import { Formik, Form, FormikHelpers } from 'formik'
import { useRouter } from 'next/router'
import { Button, Box, Spinner, Flex, useToast, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import {
  FieldError,
  LoginInput,
  MeDocument,
  MeQuery,
  useLoginMutation,
} from '../generated/graphql'
import { mapFieldErrors } from '../helpers/mapFieldErrors'
import { useCheckAuth } from '../utils/useCheckAuth'

const Login = () => {
  const router = useRouter()
  const { data: authData, loading: authLoading } = useCheckAuth()
  const [loginUser, { error }] = useLoginMutation()
  const initialValues: LoginInput = { usernameOrEmail: '', password: '' }
  const toast = useToast()

  const onLoginSubmit = async (
    values: LoginInput,
    { setErrors }: FormikHelpers<LoginInput>,
  ) => {
    const res = await loginUser({
      variables: {
        loginInput: values,
      },
      update(cache, { data }) {
        if (data?.login.success) {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.login.user,
            },
          })
        }
      },
    })
    if (!res.data?.login.success) {
      setErrors(mapFieldErrors(res.data?.login.errors as FieldError[]))
      return
    }
    toast({
      title: 'Welcome',
      description: 'Logged in successfully!',
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
          {error && <p>Failed to login. Internal server error</p>}
          <Formik initialValues={initialValues} onSubmit={onLoginSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="usernameOrEmail"
                  label="Username or email"
                  placeholder="Username or email"
                  type="text"
                />
                <Box mt={4}>
                  <InputField
                    name="password"
                    label="Password"
                    placeholder="Password"
                    type="password"
                  />
                </Box>
                <Flex mt={5}>
                  <NextLink href="/forgot-password">
                    <Link ml="auto">Forgot password</Link>
                  </NextLink>
                </Flex>
                <Button
                  type="submit"
                  colorScheme="teal"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      )}
    </>
  )
}

export default Login
