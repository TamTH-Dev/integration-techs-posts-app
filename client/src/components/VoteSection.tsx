import React, { useState } from 'react'
import { Flex, IconButton } from '@chakra-ui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'

import {
  PostWithUserInfoFragment,
  useVoteMutation,
  VoteType,
} from '../generated/graphql'

interface VoteSectionProps {
  post: PostWithUserInfoFragment
}

enum VoteTypeValues {
  Upvote = 1,
  Downvote = -1,
}

const VoteSection = ({ post }: VoteSectionProps) => {
  const [vote, { loading }] = useVoteMutation()

  const [loadingState, setLoadingState] = useState<
    'not-loading' | 'upvote-loading' | 'downvote-loading'
  >('not-loading')

  const onVote = async (voteType: VoteType) => {
    const demo =
      post.voteType === VoteTypeValues.Upvote
        ? VoteType.Upvote
        : VoteType.Downvote
    if (demo === voteType) return
    setLoadingState(
      voteType === VoteType.Upvote ? 'upvote-loading' : 'downvote-loading',
    )
    await vote({
      variables: {
        postId: parseInt(post.id),
        voteValue: voteType,
      },
    })
    setLoadingState('not-loading')
  }

  const isLoading = (lst: string) => lst === loadingState && loading

  return (
    <Flex direction="column" alignItems="center" mr={4}>
      <IconButton
        icon={<ChevronUpIcon />}
        aria-label="upvote"
        onClick={() => onVote(VoteType.Upvote)}
        isLoading={isLoading('upvote-loading')}
        colorScheme={
          post.voteType === VoteTypeValues.Upvote ? 'green' : undefined
        }
      />
      {post.points}
      <IconButton
        icon={<ChevronDownIcon />}
        aria-label="downvote"
        onClick={() => onVote(VoteType.Downvote)}
        isLoading={isLoading('downvote-loading')}
        colorScheme={
          post.voteType === VoteTypeValues.Downvote ? 'red' : undefined
        }
      />
    </Flex>
  )
}

export default VoteSection
