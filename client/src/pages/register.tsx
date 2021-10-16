import { Formik, Form, FormikHelpers } from 'formik'
import { Button, Box } from '@chakra-ui/react'

import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import { RegisterInput, useRegisterMutation } from '../generated/graphql'

const Register = () => {
  const [registerUser, { data, error, loading: _registerUserLoading }] =
    useRegisterMutation()
  const initialValues = { username: '', email: '', password: '' }

  const handleSubmit = async (
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>,
  ) => {
    await registerUser({
      variables: {
        registerInput: values,
      },
    })
    if (data?.register.errors) {
      setErrors({
        username: 'Wrong'
      })
    }
  }
  return (
    <Wrapper>
      {error && <p>Failed to register</p>}
      {data && data.register.success && (
        <p>Register successfully {JSON.stringify(data)}</p>
      )}
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
  )
}

export default Register
