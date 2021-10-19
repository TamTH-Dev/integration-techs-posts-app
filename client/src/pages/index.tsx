import React from 'react'
import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { NetworkStatus } from '@apollo/client'

import Layout from '../components/Layout'
import {
  GetPostsDocument,
  useGetPostsQuery,
  useMeQuery,
} from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'
import PostButtons from '../components/PostButtons'

const limit = 5

const Index = () => {
  const { data: meData } = useMeQuery()

  const { data, fetchMore, networkStatus } = useGetPostsQuery({
    variables: { limit },
    notifyOnNetworkStatusChange: true, // Components which use useQuery rerender on network status change
  })

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore

  const loadMorePosts = () =>
    fetchMore({ variables: { cursor: data?.getPosts?.cursor } })

  return (
    <>
      <Layout>
        <Stack spacing={8} mb={10}>
          {data?.getPosts?.paginatedPosts.map((post) => (
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
                    {meData?.me?.id === post.user.id && (
                      <PostButtons postId={post.id} />
                    )}
                  </Box>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stack>
        {data?.getPosts?.hasMore && (
          <Flex>
            <Button
              m="auto"
              my={8}
              isLoading={loadingMorePosts}
              onClick={loadMorePosts}
            >
              {loadingMorePosts ? 'Loading' : 'Show more'}
            </Button>
          </Flex>
        )}
      </Layout>
    </>
  )
}

export const getStaticProps = async () => {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: GetPostsDocument,
    variables: { limit },
  })

  return addApolloState(apolloClient, {
    props: {},
  })
}

export default Index
