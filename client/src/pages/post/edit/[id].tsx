import React from 'react'
import { useRouter } from 'next/router'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Link,
  Spinner,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'

import {
  UpdatePostInput,
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql'
import Layout from '../../../components/Layout'
import InputField from '../../../components/InputField'

const PostEdit = () => {
  const router = useRouter()

  const postId = router.query.id as string

  const { data: meData, loading: meLoading } = useMeQuery()

  const { data: postData, loading: postLoading } = usePostQuery({
    variables: { id: postId || '' },
  })

  const [updatePost] = useUpdatePostMutation()

  if (meLoading || postLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    )
  }

  if (!postData?.getPost) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Post does not exist</AlertTitle>
        </Alert>
        <Box mt={6}>
          <NextLink href="/">
            <Button>Back to Home Page</Button>
          </NextLink>
        </Box>
      </Layout>
    )
  }

  const initialValues: Omit<UpdatePostInput, 'id'> = {
    title: postData.getPost.title,
    text: postData.getPost.text,
  }

  if (meData?.me?.id.toString() !== postData.getPost.userId.toString()) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Unauthorized</AlertTitle>
        </Alert>
        <Box mt={6}>
          <NextLink href="/">
            <Button>Back to Home Page</Button>
          </NextLink>
        </Box>
      </Layout>
    )
  }

  const onUpdatePostSubmit = async (values: Omit<UpdatePostInput, 'id'>) => {
    await updatePost({
      variables: {
        updatePostInput: {
          id: postId,
          ...values,
        },
      },
    })
    router.push('/')
  }

  return (
    <Layout>
      <Formik initialValues={initialValues} onSubmit={onUpdatePostSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              label="Title"
              placeholder="Title"
              type="text"
            />
            <Box mt={4}>
              <InputField
                name="text"
                label="Text"
                placeholder="Text"
                type="textarea"
                textarea
              />
            </Box>
            <Flex justifyContent="space-between" alignItems="center" mt={6}>
              <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
                Update post
              </Button>
              <NextLink href="/">
                <Button>Go back to Home Page</Button>
              </NextLink>
            </Flex>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default PostEdit
