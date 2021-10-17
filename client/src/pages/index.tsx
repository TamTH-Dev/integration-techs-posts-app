import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Link,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'

import Layout from '../components/Layout'
import { GetPostsDocument, useGetPostsQuery } from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'
import PostButtons from '../components/PostButtons'

const Index = () => {
  const { data, loading } = useGetPostsQuery()
  return (
    <>
      <Layout>
        {loading ? (
          <Flex h="100vh" justifyContent="center" alignItems="center">
            <Spinner />
          </Flex>
        ) : (
          <Stack spacing={8}>
            {data?.getPosts?.map((post) => (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                {/* <UpvoteSection post={post} /> */}
                <Box flex={1}>
                  <NextLink href={`/post/${post.id}`}>
                    <Link>
                      <Heading fontSize="xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>Posted by {post.user.username}</Text>
                  <Flex align="center">
                    <Text mt={4}>{post.textSnippet}</Text>
                    <Box ml="auto">
                      <PostButtons />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Stack>
        )}
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GetPostsDocument,
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}

export default Index
