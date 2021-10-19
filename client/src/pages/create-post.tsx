import React from 'react'
import { Box, Button, Flex, Link, Spinner } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { useCheckAuth } from '../utils/useCheckAuth'
import Layout from '../components/Layout'
import InputField from '../components/InputField'
import { CreatePostInput, useCreatePostMutation } from '../generated/graphql'

const CreatePost = () => {
  const { data: authData, loading: authLoading } = useCheckAuth()

  const [createPost] = useCreatePostMutation()

  const router = useRouter()

  const initialValues: CreatePostInput = { title: '', text: '' }

  const onCreatePostSubmit = async (values: CreatePostInput) => {
    await createPost({
      variables: {
        createPostInput: values,
      },
      update(cache, { data }) {
        cache.modify({
          fields: {
            getPosts(existing) {
              if (!data?.createPost.success || !data?.createPost.post) return

              const newPostRef = cache.identify(data.createPost.post)
              const newPostAfterCreation = {
                ...existing,
                totalCount: existing.totalCount + 1,
                paginatedPosts: [
                  { __ref: newPostRef },
                  ...existing.paginatedPosts,
                ],
              }

              return newPostAfterCreation
            },
          },
        })
      },
    })
    router.push('/')
  }

  if (authLoading || (!authLoading && !authData?.me)) {
    return (
      <Flex justifyContent="center" alignItems="center" minH="100vh">
        <Spinner />
      </Flex>
    )
  } else {
    return (
      <Layout>
        <Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
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
              <Button
                type="submit"
                colorScheme="teal"
                mt={4}
                isLoading={isSubmitting}
              >
                Create post
              </Button>
            </Form>
          )}
        </Formik>
        <Box mt={6}>
          <NextLink href="/">
            <Link>Go back to Home Page</Link>
          </NextLink>
        </Box>
      </Layout>
    )
  }
}

export default CreatePost
