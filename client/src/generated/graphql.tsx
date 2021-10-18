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

export type ChangePasswordInput = {
  newPassword: Scalars['String']
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

export type ForgotPasswordInput = {
  email: Scalars['String']
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
  changePassword: UserMutationResponse
  createPost: PostMutationResponse
  deletePost: PostMutationResponse
  forgotPassword: Scalars['Boolean']
  login: UserMutationResponse
  logout: Scalars['Boolean']
  register: UserMutationResponse
  updatePost: PostMutationResponse
}

export type MutationChangePasswordArgs = {
  changePasswordInput: ChangePasswordInput
  token: Scalars['String']
  userId: Scalars['String']
}

export type MutationCreatePostArgs = {
  createPostInput: CreatePostInput
}

export type MutationDeletePostArgs = {
  id: Scalars['ID']
}

export type MutationForgotPasswordArgs = {
  forgotPasswordInput: ForgotPasswordInput
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

export type PaginatedPosts = {
  __typename?: 'PaginatedPosts'
  cursor: Scalars['DateTime']
  hasMore: Scalars['Boolean']
  paginatedPosts: Array<Post>
  totalCount: Scalars['Float']
}

export type Post = {
  __typename?: 'Post'
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  text: Scalars['String']
  textSnippet: Scalars['String']
  title: Scalars['String']
  updatedAt: Scalars['DateTime']
  user: User
  userId: Scalars['Float']
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
  getPosts?: Maybe<PaginatedPosts>
  me?: Maybe<User>
}

export type QueryGetPostArgs = {
  id: Scalars['ID']
}

export type QueryGetPostsArgs = {
  cursor?: Maybe<Scalars['String']>
  limit: Scalars['Int']
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
  posts: Array<Post>
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

export type PostWithUserInfoFragment = {
  __typename?: 'Post'
  id: string
  title: string
  text: string
  createdAt: any
  updatedAt: any
  textSnippet: string
  user: { __typename?: 'User'; username: string; email: string }
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

export type ChangePasswordMutationVariables = Exact<{
  userId: Scalars['String']
  token: Scalars['String']
  changePasswordInput: ChangePasswordInput
}>

export type ChangePasswordMutation = {
  __typename?: 'Mutation'
  changePassword: {
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

export type CreatePostMutationVariables = Exact<{
  createPostInput: CreatePostInput
}>

export type CreatePostMutation = {
  __typename?: 'Mutation'
  createPost: {
    __typename?: 'PostMutationResponse'
    code: number
    message?: string | null | undefined
    success: boolean
    errors?:
      | Array<{ __typename?: 'FieldError'; field: string; message: string }>
      | null
      | undefined
    post?:
      | {
          __typename?: 'Post'
          id: string
          title: string
          text: string
          createdAt: any
          updatedAt: any
          textSnippet: string
          user: { __typename?: 'User'; username: string; email: string }
        }
      | null
      | undefined
  }
}

export type ForgotPasswordMutationVariables = Exact<{
  forgotPasswordInput: ForgotPasswordInput
}>

export type ForgotPasswordMutation = {
  __typename?: 'Mutation'
  forgotPassword: boolean
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

export type GetPostsQueryVariables = Exact<{
  limit: Scalars['Int']
  cursor?: Maybe<Scalars['String']>
}>

export type GetPostsQuery = {
  __typename?: 'Query'
  getPosts?:
    | {
        __typename?: 'PaginatedPosts'
        totalCount: number
        cursor: any
        hasMore: boolean
        paginatedPosts: Array<{
          __typename?: 'Post'
          id: string
          title: string
          text: string
          createdAt: any
          updatedAt: any
          textSnippet: string
          user: { __typename?: 'User'; username: string; email: string }
        }>
      }
    | null
    | undefined
}

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = {
  __typename?: 'Query'
  me?:
    | { __typename?: 'User'; id: string; username: string; email: string }
    | null
    | undefined
}

export const PostWithUserInfoFragmentDoc = gql`
  fragment postWithUserInfo on Post {
    id
    title
    text
    createdAt
    updatedAt
    textSnippet
    user {
      username
      email
    }
  }
`
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
export const ChangePasswordDocument = gql`
  mutation ChangePassword(
    $userId: String!
    $token: String!
    $changePasswordInput: ChangePasswordInput!
  ) {
    changePassword(
      userId: $userId
      token: $token
      changePasswordInput: $changePasswordInput
    ) {
      ...userMutationResponse
    }
  }
  ${UserMutationResponseFragmentDoc}
`
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      token: // value for 'token'
 *      changePasswordInput: // value for 'changePasswordInput'
 *   },
 * });
 */
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument, options)
}
export type ChangePasswordMutationHookResult = ReturnType<
  typeof useChangePasswordMutation
>
export type ChangePasswordMutationResult =
  Apollo.MutationResult<ChangePasswordMutation>
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>
export const CreatePostDocument = gql`
  mutation CreatePost($createPostInput: CreatePostInput!) {
    createPost(createPostInput: $createPostInput) {
      code
      message
      success
      errors {
        ...fieldError
      }
      post {
        ...postWithUserInfo
      }
    }
  }
  ${FieldErrorFragmentDoc}
  ${PostWithUserInfoFragmentDoc}
`
export type CreatePostMutationFn = Apollo.MutationFunction<
  CreatePostMutation,
  CreatePostMutationVariables
>

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      createPostInput: // value for 'createPostInput'
 *   },
 * });
 */
export function useCreatePostMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreatePostMutation,
    CreatePostMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument,
    options,
  )
}
export type CreatePostMutationHookResult = ReturnType<
  typeof useCreatePostMutation
>
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<
  CreatePostMutation,
  CreatePostMutationVariables
>
export const ForgotPasswordDocument = gql`
  mutation ForgotPassword($forgotPasswordInput: ForgotPasswordInput!) {
    forgotPassword(forgotPasswordInput: $forgotPasswordInput)
  }
`
export type ForgotPasswordMutationFn = Apollo.MutationFunction<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      forgotPasswordInput: // value for 'forgotPasswordInput'
 *   },
 * });
 */
export function useForgotPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ForgotPasswordMutation,
    ForgotPasswordMutationVariables
  >(ForgotPasswordDocument, options)
}
export type ForgotPasswordMutationHookResult = ReturnType<
  typeof useForgotPasswordMutation
>
export type ForgotPasswordMutationResult =
  Apollo.MutationResult<ForgotPasswordMutation>
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<
  ForgotPasswordMutation,
  ForgotPasswordMutationVariables
>
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
export const GetPostsDocument = gql`
  query GetPosts($limit: Int!, $cursor: String) {
    getPosts(limit: $limit, cursor: $cursor) {
      totalCount
      cursor
      hasMore
      paginatedPosts {
        ...postWithUserInfo
      }
    }
  }
  ${PostWithUserInfoFragmentDoc}
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
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetPostsQuery(
  baseOptions: Apollo.QueryHookOptions<GetPostsQuery, GetPostsQueryVariables>,
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
