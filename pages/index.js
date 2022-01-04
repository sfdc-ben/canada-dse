import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Flex, Box, Heading, Input, Spinner } from "@chakra-ui/react"
import Head from 'next/head'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import CTA from '../components/CallToAction'
import { useUser } from '../services/auth';

const Home = () => {
    const { user, loading } = useUser()
    const router = useRouter()
  
    useEffect(() => {
      if (!(user || loading)) {
        router.push('/auth')
      }
    })

    return (
        <>
         <Head>
            <title>Something Ridiculous</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        {user ? (
            <div>
                <NavBar></NavBar>
                <Box position={'relative'} top={'70px'} height="100%" overflow="scroll">
                    <Hero></Hero>
                    <CTA></CTA>
                    <Footer></Footer>
                </Box>
                
            </div>
            ) : (
                <div>
                    <Flex direction="column" background="gray.500">
                    </Flex>
                </div>
            )
        }
        </>
    )
    
}

export default Home