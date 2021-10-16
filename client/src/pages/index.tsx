import React from 'react'

import Navbar from '../components/Navbar'
import { GetPostsDocument } from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'

const Index = () => {
  // const { data, loading } = useGetPostsQuery()
  return (
    <>
      <Navbar />
      {/* {loading ? ( */}
      {/*   <p>Loading posts...</p> */}
      {/* ) : ( */}
      {/*   data?.getPosts?.map((post) => <li>{post.title}</li>) */}
      {/* )} */}
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
