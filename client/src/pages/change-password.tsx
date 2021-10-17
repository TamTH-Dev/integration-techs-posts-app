import React from 'react'
import { Form, Formik } from 'formik'
import { Box, Button } from '@chakra-ui/react'

import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'
import {
  ChangePasswordInput,
  useChangePasswordMutation,
} from '../generated/graphql'

const ChangePassword = () => {
  const [changePassword, { loading, data }] = useChangePasswordMutation()
  const initialValues: ChangePasswordInput = { newPassword: '' }

  const onChangePasswordSubmit = async (values: ChangePasswordInput) => {
    changePassword({
      variables: {
        userId: '',
        token: '',
        changePasswordInput: values,
      },
    })
  }

  return (
    <Wrapper>
      <Formik initialValues={initialValues} onSubmit={onChangePasswordSubmit}>
        {({ isSubmitting }) =>
          !loading && data ? (
            <Box>Please check your inbox</Box>
          ) : (
            <Form>
              <InputField
                name="email"
                label="Email"
                placeholder="Email"
                type="text"
              />
              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Send Email
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  )
}

export default ChangePassword
