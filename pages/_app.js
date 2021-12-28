import { ChakraProvider } from '@chakra-ui/react'
import theme from '../styles/theme'
import "@fontsource/actor"
import "@fontsource/bebas-neue"

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp