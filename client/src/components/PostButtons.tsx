import React from "react"
import { DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, IconButton } from "@chakra-ui/react"
import NextLink from 'next/link'

const PostButtons = () => {
  return (
    <Box>
      <NextLink href={`/post/edit`}>
        <IconButton icon={<EditIcon />} aria-label="edit" mr={4} />
      </NextLink>

      <IconButton
        icon={<DeleteIcon />}
        aria-label="delete"
        colorScheme="red"
      />
    </Box>
  )
}

export default PostButtons
