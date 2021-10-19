import React from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
} from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import {
  PostDocument,
  PostIdsDocument,
  PostIdsQuery,
  PostQuery,
  useMeQuery,
  usePostQuery,
} from '../../generated/graphql'
import Layout from '../../components/Layout'
import { addApolloState, initializeApollo } from '../../lib/apolloClient'
import PostButtons from '../../components/PostButtons'

const Post = () => {
  const router = useRouter()

  const { data: meData } = useMeQuery()

  const { data, loading, error } = usePostQuery({
    variables: {
      id: router.query.id as string,
    },
  })

  if (loading) {
    return (
      <Flex h="100vh" justifyContent="center" alignItems="center">
        <Spinner />
      </Flex>
    )
  }

  if (error || !data?.getPost) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>{error ? error.message : 'Post not found'}</AlertTitle>
        </Alert>
        <Box mt={6}>
          <NextLink href="/">
            <Button>Back to Home Page</Button>
          </NextLink>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Heading mb={4}>{data.getPost.title}</Heading>
      <Box mb={4}>{data.getPost.text}</Box>
      <Flex mt={6} alignItems="center" justifyContent="space-between">
        {meData?.me?.id.toString() === data.getPost.userId.toString() && (
          <PostButtons postId={data.getPost.id} />
        )}
        <Box>
          <NextLink href="/">
            <Button>Back to Home Page</Button>
          </NextLink>
        </Box>
      </Flex>
    </Layout>
  )
}

const limit = 5

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<PostIdsQuery>({
    query: PostIdsDocument,
    variables: { limit },
  })

  return {
    paths: data.getPosts!.paginatedPosts.map((post) => ({
      params: { id: post.id.toString() },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  { [key: string]: any },
  { id: string }
> = async ({ params }) => {
  const apolloClient = initializeApollo()
  await apolloClient.query<PostQuery>({
    query: PostDocument,
    variables: {
      id: params?.id,
    },
  })
  return addApolloState(apolloClient, {
    props: {},
  })
}

export default Post
