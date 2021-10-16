import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
const defaultOptions = {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any
}

export type CreatePostInput = {
  text: Scalars['String']
  title: Scalars['String']
}

export type FieldError = {
  __typename?: 'FieldError'
  field: Scalars['String']
  message: Scalars['String']
}

export type IMutationResponse = {
  code: Scalars['Float']
  message?: Maybe<Scalars['String']>
  success: Scalars['Boolean']
}

export type LoginInput = {
  password: Scalars['String']
  usernameOrEmail: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  createPost: PostMutationResponse
  deletePost: PostMutationResponse
  login: UserMutationResponse
  logout: Scalars['Boolean']
  register: UserMutationResponse
  updatePost: PostMutationResponse
}

export type MutationCreatePostArgs = {
  createPostInput: CreatePostInput
}

export type MutationDeletePostArgs = {
  id: Scalars['ID']
}

export type MutationLoginArgs = {
  loginInput: LoginInput
}

export type MutationRegisterArgs = {
  registerInput: RegisterInput
}

export type MutationUpdatePostArgs = {
  updatePostInput: UpdatePostInput
}

export type Post = {
  __typename?: 'Post'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  text: Scalars['String']
  title: Scalars['String']
  updatedAt: Scalars['DateTime']
}

export type PostMutationResponse = IMutationResponse & {
  __typename?: 'PostMutationResponse'
  code: Scalars['Float']
  errors?: Maybe<Array<FieldError>>
  message?: Maybe<Scalars['String']>
  post?: Maybe<Post>
  success: Scalars['Boolean']
}

export type Query = {
  __typename?: 'Query'
  getPost?: Maybe<Post>
  getPosts?: Maybe<Array<Post>>
  me?: Maybe<User>
}

export type QueryGetPostArgs = {
  id: Scalars['ID']
}

export type RegisterInput = {
  email: Scalars['String']
  password: Scalars['String']
  username: Scalars['String']
}

export type UpdatePostInput = {
  id: Scalars['ID']
  text: Scalars['String']
  title: Scalars['String']
}

export type User = {
  __typename?: 'User'
  createdAt: Scalars['DateTime']
  email: Scalars['String']
  id: Scalars['ID']
  updatedAt: Scalars['DateTime']
  username: Scalars['String']
}

export type UserMutationResponse = IMutationResponse & {
  __typename?: 'UserMutationResponse'
  code: Scalars['Float']
  errors?: Maybe<Array<FieldError>>
  message?: Maybe<Scalars['String']>
  success: Scalars['Boolean']
  user?: Maybe<User>
}

export type FieldErrorFragment = {
  __typename?: 'FieldError'
  field: string
  message: string
}

export type MutationStatusesFragment = {
  __typename?: 'UserMutationResponse'
  code: number
  success: boolean
  message?: string | null | undefined
}

export type UserInfoFragment = {
  __typename?: 'User'
  id: string
  username: string
  email: string
}

export type UserMutationResponseFragment = {
  __typename?: 'UserMutationResponse'
  code: number
  success: boolean
  message?: string | null | undefined
  user?:
    | { __typename?: 'User'; id: string; username: string; email: string }
    | null
    | undefined
  errors?:
    | Array<{ __typename?: 'FieldError'; field: string; message: string }>
    | null
    | undefined
}

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput
}>

export type LoginMutation = {
  __typename?: 'Mutation'
  login: {
    __typename?: 'UserMutationResponse'
    code: number
    success: boolean
    message?: string | null | undefined
    user?:
      | { __typename?: 'User'; id: string; username: string; email: string }
      | null
      | undefined
    errors?:
      | Array<{ __typename?: 'FieldError'; field: string; message: string }>
      | null
      | undefined
  }
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { __typename?: 'Mutation'; logout: boolean }

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput
}>

export type RegisterMutation = {
  __typename?: 'Mutation'
  register: {
    __typename?: 'UserMutationResponse'
    code: number
    success: boolean
    message?: string | null | undefined
    user?:
      | { __typename?: 'User'; id: string; username: string; email: string }
      | null
      | undefined
    errors?:
      | Array<{ __typename?: 'FieldError'; field: string; message: string }>
      | null
      | undefined
  }
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me?:
    | { __typename?: 'User'; id: string; username: string; email: string }
    | null
    | undefined
}

export type GetPostsQueryVariables = Exact<{ [key: string]: never }>

export type GetPostsQuery = {
  __typename?: 'Query'
  getPosts?:
    | Array<{
        __typename?: 'Post'
        id: string
        title: string
        text: string
        createdAt: any
        updatedAt: any
      }>
    | null
    | undefined
}

export const MutationStatusesFragmentDoc = gql`
  fragment mutationStatuses on UserMutationResponse {
    code
    success
    message
  }
`
export const UserInfoFragmentDoc = gql`
  fragment userInfo on User {
    id
    username
    email
  }
`
export const FieldErrorFragmentDoc = gql`
  fragment fieldError on FieldError {
    field
    message
  }
`
export const UserMutationResponseFragmentDoc = gql`
  fragment userMutationResponse on UserMutationResponse {
    ...mutationStatuses
    user {
      ...userInfo
    }
    errors {
      ...fieldError
    }
  }
  ${MutationStatusesFragmentDoc}
  ${UserInfoFragmentDoc}
  ${FieldErrorFragmentDoc}
`
export const LoginDocument = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      ...userMutationResponse
    }
  }
  ${UserMutationResponseFragmentDoc}
`
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options,
  )
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`
export type LogoutMutationFn = Apollo.MutationFunction<
  LogoutMutation,
  LogoutMutationVariables
>

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LogoutMutation,
    LogoutMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument,
    options,
  )
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>
export type LogoutMutationOptions = Apollo.BaseMutationOptions<
  LogoutMutation,
  LogoutMutationVariables
>
export const RegisterDocument = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      ...userMutationResponse
    }
  }
  ${UserMutationResponseFragmentDoc}
`
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options,
  )
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>
export const MeDocument = gql`
  query Me {
    me {
      ...userInfo
    }
  }
  ${UserInfoFragmentDoc}
`

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>
export const GetPostsDocument = gql`
  query GetPosts {
    getPosts {
      id
      title
      text
      createdAt
      updatedAt
    }
  }
`

/**
 * __useGetPostsQuery__
 *
 * To run a query within a React component, call `useGetPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPostsQuery(
  baseOptions?: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetPostsQuery, GetPostsQueryVariables>(
    GetPostsDocument,
    options,
  )
}
export function useGetPostsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPostsQuery,
    GetPostsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetPostsQuery, GetPostsQueryVariables>(
    GetPostsDocument,
    options,
  )
}
export type GetPostsQueryHookResult = ReturnType<typeof useGetPostsQuery>
export type GetPostsLazyQueryHookResult = ReturnType<
  typeof useGetPostsLazyQuery
>
export type GetPostsQueryResult = Apollo.QueryResult<
  GetPostsQuery,
  GetPostsQueryVariables
>
