import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from "js-cookie";
import { Flex, Box, Heading, Input } from "@chakra-ui/react"
import Head from 'next/head'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import CTA from '../components/CallToAction'
import Auth from './auth'

const useUser = () => {
    return {
        user: Cookies.get("accessToken"),
        loading: false
    }
}

const Home = () => {
    const { user, loading } = useUser()
    const router = useRouter()
  
    useEffect(() => {
      if (!(user || loading)) {
        router.push('/auth')
      } else {
        return (
            <div>
                <Head>
                    <title>Something Ridiculous</title>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                </Head>
                <NavBar></NavBar>
    
                <Box height="100%" overflow="scroll">
                    <Hero></Hero>
                    <CTA></CTA>
                    {/* <Flex height="100vh" direction="column" background="gray.500" p={16} rounded={10}>
                        <Heading color="blue.300">Hello there!</Heading>
                    </Flex> */}
                </Box>
                <Footer></Footer>
            </div>
        )

      }
    }, [user, loading])

    return (
        <Auth></Auth>
    )
    
}

export default Home