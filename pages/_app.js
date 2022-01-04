import { ChakraProvider } from '@chakra-ui/react'
import theme from '../styles/theme'
import Fonts from '../styles/fonts'
import "@fontsource/actor"
import "@fontsource/bebas-neue"
import "@fontsource/francois-one"
import "@fontsource/oxygen"

function MyApp({ Component, pageProps }) {
  return (
      <ChakraProvider theme={theme}>
        <Fonts />
        <Component {...pageProps} />
      </ChakraProvider>
  )
}

export default MyApp