import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'

import theme from '../theme'
import { AppProps } from 'next/app'
import { useApollo } from '../lib/apolloClient'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
