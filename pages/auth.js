import { useState } from 'react';
import { useRouter } from 'next/router'
import {
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    InputRightElement,
    InputGroup,
    Button,
    SimpleGrid,
    Avatar,
    AvatarGroup,
    useBreakpointValue,
    IconProps,
    Icon,
    Fade,
    useDisclosure,
    useToast,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react';
import { sendLoginRequest, checkDomain, checkPassword, sendRegisterRequest, sendResetRequest } from '../services/auth';

export default function JoinOurTeam() {
    const router = useRouter()
    
    // Handle State

    const [authType, setType] = useState('Login');

    const [show, setShow] = useState(false)
    const handleShow = () => setShow(!show)

    const [resetShow, setResetShow] = useState(false)
    const handleResetShow = () => setResetShow(!resetShow)

    const [username, setUsername] = useState('')
    const handleUsernameInput = (event) => setUsername(event.target.value)

    const [password, setPassword] = useState('')
    const handlePasswordInput = (event) => {
        setPassword(event.target.value)
        setMatch(event.target.value === confirmPassword)
    }

    const [confirmPassword, setConfirmPassword] = useState('')
    const handleConfirmPasswordInput = (event) => {
        setConfirmPassword(event.target.value)
        setMatch(password === event.target.value)
    }

    const [resetPassword, setResetPassword] = useState('')
    const handleResetPasswordInput = (event) => {
        setResetPassword(event.target.value)
        setResetMatch(event.target.value === confirmResetPassword)
    }

    const [confirmResetPassword, setConfirmResetPassword] = useState('')
    const handleConfirmResetPasswordInput = (event) => {
        setConfirmResetPassword(event.target.value)
        setResetMatch(resetPassword === event.target.value)
    }

    const [match, setMatch] = useState(false)
    const [resetMatch, setResetMatch] = useState(false)
    
    // Handle Discolsure
    const { isOpen, onToggle } = useDisclosure()
    const modal = useDisclosure()

    // Interaction Handlers
    const handleLoginType = (event) => {
        setType('Login')
        onToggle()
    }
    const handleJoinType = (event) => {
        setType('Join')
        onToggle()
    }

    const toast = useToast()
    const fireToast = ( resObj ) => {
        toast({
            title: resObj.title,
            description: resObj.message,
            status: resObj.status,
            duration: 9000,
            isClosable: true,
          })
    }

    const login = async () => {
        if (!checkDomain(username)) {
            fireToast({
                title: 'Login',
                status: 'error',
                message: 'Invalid email domain. Please make sure you are using a valid Salesforce or customer domain'
            })
            return
        }
        await sendLoginRequest(username, password)
        .then((data) => {
            router.push('/')
        })
        .catch((error) => {
            console.log(error)
            fireToast({
                title: 'Login Request',
                status: 'error',
                message: 'Invalid login credentials. Please try again or register for an account.'
            })
        })
    }

    const reset = async () => {
        const check = checkPassword(resetPassword, confirmResetPassword)
        if (check.pass) {
            console.log(username, resetPassword, confirmResetPassword)
            await sendResetRequest(username, resetPassword, confirmResetPassword)
            .then((response) => {
                fireToast({
                    title: 'Reset Password',
                    status: 'success',
                    message: 'Email Sent. Please check your email and click the link to finalize the password reset.'
                })
                setConfirmResetPassword('')
                setResetPassword('')
                setUsername('')
                modal.onClose()
            })
            .catch(error => {
                console.log(error)
                fireToast({
                    title: 'Reset Password',
                    status: 'error',
                    message: 'An account may not exist for this email. Try registering for an account.'
                })
            })
        } else {
            fireToast({
                title: 'Reset Password',
                status: 'error',
                message: check.error
            })
        }
    }

    const register = async () => {
        if (!checkDomain(username)) {
            fireToast({
                title: 'Registration',
                status: 'error',
                message: 'Invalid email domain. Please make sure you are using a valid Salesforce or customer domain'
            })
            return
        }
        const check = checkPassword(password, confirmPassword)
        if (check.pass) {
            console.log(username, password, confirmPassword)
            await sendRegisterRequest(username, password, confirmPassword)
            .then((response) => {
                fireToast({
                    title: 'Registration',
                    status: 'success',
                    message: 'Account Created! Please check your email to verify your account'
                })
                setUsername('')
                setPassword('')
                setConfirmPassword('')

            })
            .catch(error => {
                console.log(error)
                fireToast({
                    title: 'Registration',
                    status: 'error',
                    message: 'An account may already exist for this email. Try resetting your password.'
                })
            })
        } else {
            fireToast({
                title: 'Registration',
                status: 'error',
                message: check.error
            })
        }
        
    }


    return (
        <Box position={'relative'}>
            <Container
                as={SimpleGrid}
                maxW={'7xl'}
                columns={{ base: 1, md: 2 }}
                spacing={{ base: 10, lg: 32 }}
                py={{ base: 10, sm: 20, lg: 32 }}>
                <Stack spacing={{ base: 10, md: 20 }}>
                    <Heading
                        lineHeight={1.1}
                        fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}>
                        The Best of Salesforce{' '}
                        <Text
                            as={'span'}
                            bgGradient="linear(to-r, red.400,pink.400)"
                            bgClip="text">
                            &
                        </Text>{' '}
                        Solution Engineering
                    </Heading>
                </Stack>

{/* if */} 
                {authType === 'Join' ? (
                    <Fade in={isOpen}>
                        <Stack
                            bg={'gray.50'}
                            rounded={'xl'}
                            p={{ base: 4, sm: 6, md: 8 }}
                            spacing={{ base: 8 }}
                            maxW={{ lg: 'lg' }}>
                            <Stack spacing={4}>
                                <Heading
                                    color={'gray.800'}
                                    lineHeight={1.1}
                                    fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                                    Register to Join
                                    <Text
                                        as={'span'}
                                        bgGradient="linear(to-r, red.400,pink.400)"
                                        bgClip="text">
                                        !
                                    </Text>
                                </Heading>
                                <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                                    We’re looking for amazing engineers just like you! Become a part
                                    of our rockstar engineering team and skyrocket your career!
                                </Text>
                            </Stack>
                            <Box as={'form'} mt={10}>
                                <Stack spacing={4}>
                                <Input
                                        placeholder="Email"
                                        bg={'gray.100'}
                                        border={0}
                                        color={'gray.500'}
                                        _placeholder={{
                                            color: 'gray.500',
                                        }}
                                        onChange={handleUsernameInput}
                                        value={username}
                                    />
                                    <InputGroup size='md'>
                                        <Input
                                            pr='4.5rem'
                                            type={show ? 'text' : 'password'}
                                            placeholder='Enter password'
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            onChange={handlePasswordInput}
                                            value={password}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button
                                                h='1.75rem'
                                                size='sm'
                                                onClick={handleShow}
                                                _focus={{
                                                    boxShadow: 'none'
                                                }}>
                                            {show ? 'Hide' : 'Show'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    <InputGroup size='md'>
                                        <Input
                                            pr='4.5rem'
                                            type={'password'}
                                            placeholder='Confirm password'
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            onChange={handleConfirmPasswordInput}
                                            value={confirmPassword}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button
                                                h='1.75rem'
                                                size='sm'
                                                variant='ghost'
                                                colorScheme={match ? 'green' : 'red'}
                                                _focus={{
                                                    boxShadow: 'none'
                                                }}>
                                            {match ? 'Match' : 'X'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </Stack>
                                <Button
                                    fontFamily={'heading'}
                                    mt={8}
                                    w={'full'}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    color={'white'}
                                    _hover={{
                                        bgGradient: 'linear(to-r, red.400,pink.400)',
                                        boxShadow: 'xl',
                                    }}
                                    _active={{
                                        bgGradient: 'linear(to-r, red.500,pink.500)'
                                    }}
                                    _focus={{
                                        boxShadow: 'none'
                                    }}
                                    onClick={register}>
                                    Register
                                </Button>
                                <Button
                                    fontFamily={'heading'}
                                    mt={4}
                                    size={'sm'}
                                    w={'full'}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    bgClip="text"
                                    onClick={handleLoginType}
                                    _hover={{
                                        bgGradient: 'linear(to-r, red.500,pink.500)'
                                    }}
                                    _active={{
                                        bgGradient: 'linear(to-r, red.500,pink.500)'
                                    }}
                                    _focus={{
                                        boxShadow: 'none'
                                    }}>
                                    Login
                                </Button>
                            </Box>
                        </Stack>
                    </Fade>
                ) : null}
                
                {authType === 'Login' ? (
                    <Fade in={!isOpen}>
                        <Stack
                            bg={'gray.50'}
                            rounded={'xl'}
                            p={{ base: 4, sm: 6, md: 8 }}
                            spacing={{ base: 8 }}
                            maxW={{ lg: 'lg' }}>
                            <Stack spacing={4}>
                                <Heading
                                    color={'gray.800'}
                                    lineHeight={1.1}
                                    fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>
                                    Welcome Back
                                    <Text
                                        as={'span'}
                                        bgGradient="linear(to-r, red.400,pink.400)"
                                        bgClip="text">
                                        !
                                    </Text>
                                </Heading>
                                <Text color={'gray.500'} fontSize={{ base: 'sm', sm: 'md' }}>
                                    We’re looking for amazing engineers just like you! Become a part
                                    of our rockstar engineering team and skyrocket your career!
                                </Text>
                            </Stack>
                            <Box as={'form'} mt={10}>
                                <Stack spacing={4}>
                                    <Input
                                        placeholder="Email"
                                        bg={'gray.100'}
                                        border={0}
                                        color={'gray.500'}
                                        _placeholder={{
                                            color: 'gray.500',
                                        }}
                                        onChange={handleUsernameInput}
                                        value={username}
                                    />
                                    <InputGroup size='md'>
                                        <Input
                                            pr='4.5rem'
                                            type={show ? 'text' : 'password'}
                                            placeholder='Enter password'
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            onChange={handlePasswordInput}
                                            value={password}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button
                                                h='1.75rem'
                                                size='sm'
                                                onClick={handleShow}
                                                _focus={{
                                                    boxShadow: 'none'
                                                }}>
                                            {show ? 'Hide' : 'Show'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    
                                </Stack>
                                <Button
                                    fontFamily={'heading'}
                                    mt={8}
                                    w={'full'}
                                    bgGradient="linear(to-r, red.400,pink.400)"
                                    color={'white'}
                                    _hover={{
                                        bgGradient: 'linear(to-r, red.400,pink.400)',
                                        boxShadow: 'xl',
                                    }}
                                    _active={{
                                        bgGradient: 'linear(to-r, red.500,pink.500)'
                                    }}
                                    _focus={{
                                        boxShadow: 'none'
                                    }}
                                    onClick={login}>
                                    Login
                                </Button>
                                <HStack mt={'4'} align={'center'}>
                                    <Button
                                        fontFamily={'heading'}
                                        size={'sm'}
                                        w={'full'}
                                        bgGradient="linear(to-r, red.400,pink.400)"
                                        bgClip="text"
                                        onClick={handleJoinType}
                                        _hover={{
                                            bgGradient: 'linear(to-r, red.500,pink.500)'
                                        }}
                                        _active={{
                                            bgGradient: 'linear(to-r, red.500,pink.500)'
                                        }}
                                        _focus={{
                                            boxShadow: 'none'
                                        }}>
                                        Register For Access
                                    </Button>
                                    <Button
                                        fontFamily={'heading'}
                                        size={'sm'}
                                        w={'full'}
                                        bgGradient="linear(to-r, red.400,pink.400)"
                                        bgClip="text"
                                        onClick={modal.onOpen}
                                        _hover={{
                                            bgGradient: 'linear(to-r, red.500,pink.500)'
                                        }}
                                        _active={{
                                            bgGradient: 'linear(to-r, red.500,pink.500)'
                                        }}
                                        _focus={{
                                            boxShadow: 'none'
                                        }}>
                                        Reset Password
                                    </Button>
                                </HStack>
                            </Box>
                        </Stack>
                    </Fade>
                    
                ) : null}

                <Modal isOpen={modal.isOpen} onClose={modal.onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Send Password Reset</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box as={'form'}>
                                <Stack spacing={4}>
                                    <Input
                                        placeholder="Email"
                                        bg={'gray.100'}
                                        border={0}
                                        color={'gray.500'}
                                        _placeholder={{
                                            color: 'gray.500',
                                        }}
                                        onChange={handleUsernameInput}
                                        value={username}
                                    />
                                    <InputGroup size='md'>
                                        <Input
                                            pr='4.5rem'
                                            type={resetShow ? 'text' : 'password'}
                                            placeholder='Enter password'
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            onChange={handleResetPasswordInput}
                                            value={resetPassword}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button
                                                h='1.75rem'
                                                size='sm'
                                                onClick={handleResetShow}
                                                _focus={{
                                                    boxShadow: 'none'
                                                }}>
                                            {resetShow ? 'Hide' : 'Show'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                    <InputGroup size='md'>
                                        <Input
                                            pr='4.5rem'
                                            type={'password'}
                                            placeholder='Confirm password'
                                            bg={'gray.100'}
                                            border={0}
                                            color={'gray.500'}
                                            _placeholder={{
                                                color: 'gray.500',
                                            }}
                                            onChange={handleConfirmResetPasswordInput}
                                            value={confirmResetPassword}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <Button
                                                h='1.75rem'
                                                size='sm'
                                                variant='ghost'
                                                colorScheme={resetMatch ? 'green' : 'red'}
                                                _focus={{
                                                    boxShadow: 'none'
                                                }}>
                                            {resetMatch ? 'Match' : 'X'}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </Stack>
                            </Box>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                fontFamily={'heading'}
                                mt={2}
                                w={'full'}
                                bgGradient="linear(to-r, red.400,pink.400)"
                                color={'white'}
                                _hover={{
                                    bgGradient: 'linear(to-r, red.400,pink.400)',
                                    boxShadow: 'xl',
                                }}
                                _active={{
                                    bgGradient: 'linear(to-r, red.500,pink.500)'
                                }}
                                _focus={{
                                    boxShadow: 'none'   
                                }}
                                onClick={reset}>
                                Reset Password
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </Container>
            <Blur
                position={'absolute'}
                top={-10}
                left={-10}
                style={{ filter: 'blur(70px)' }}
            />
        </Box>
    );
}

export const Blur = (props) => {
    return (
        <Icon
            width={useBreakpointValue({ base: '100%', md: '40vw', lg: '30vw' })}
            zIndex={useBreakpointValue({ base: -1, md: -1, lg: -1 })}
            height="560px"
            viewBox="0 0 528 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}>
            <circle cx="71" cy="61" r="111" fill="#F56565" />
            <circle cx="244" cy="106" r="139" fill="#ED64A6" />
            <circle cy="291" r="139" fill="#ED64A6" />
            <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
            <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
            <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
            <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
        </Icon>
    );
};