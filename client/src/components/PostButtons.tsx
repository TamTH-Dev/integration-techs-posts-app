import React from 'react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'

import {
  useDeletePostMutation,
} from '../generated/graphql'
import { useRouter } from 'next/router'

interface PostButtonsProps {
  postId: string
}

const PostButtons = ({ postId }: PostButtonsProps) => {
  const router = useRouter()

  const [deletePost] = useDeletePostMutation()

  const onPostDelete = async (postId: string) => {
    await deletePost({
      variables: {
        id: postId,
      },
      update(cache, { data }) {
        if (!data?.deletePost.success) return
        cache.modify({
          fields: {
            getPosts(existing) {
              const newPosts = {
                ...existing,
                totalCount: existing.totalCount - 1,
                paginatedPosts: existing.paginatedPosts.filter(
                  (postRef: { [key: string]: any }) =>
                    postRef.__ref !== `Post:${postId}`,
                ),
              }
              return newPosts
            },
          },
        })
      },
    })
    router.push('/')
  }

  return (
    <Box>
      <NextLink href={`/post/edit/${postId}`}>
        <IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="delete"
        colorScheme="red"
        onClick={() => onPostDelete(postId)}
      />
    </Box>
  )
}

export default PostButtons
