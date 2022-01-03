import Cookies from "js-cookie"
import axios from "axios"

const customerDomains = [
    'gmail.com'
]

const checkDomain = (username) => {
    const domain = username.substring(username.lastIndexOf("@") +1)
    console.log(domain)
    const validDomains =  [
        'salesforce.com',
        'mulesoft.com',
        'tableau.com',
        'slack.com',
        ...customerDomains
    ]
    return validDomains.includes(domain)
}

const checkPassword = (password, confirmPassword) => {
    const regex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,30}$/
    if (password !== confirmPassword) {
        return {
            pass: false,
            error: 'Passwords do not match'
        }
    }
    if (password.length < 8 || password.length > 30) {
        return {
            pass: false,
            error: 'Password must be between 8 and 30 characters'
        }
    }
    if (!regex.test(password)) {
        return {
            pass: false,
            error: 'Password must at least contain 1 number, one lowercase letter, one uppercase letter, and one special character (!@#$%^&*)'
        }
    }
    return {
        pass: true
    }
}

const useUser = () => {
    if (Cookies.get("accessToken") == null || Cookies.get("accessToken") === undefined) {
        return {
            user: '',
            loading: false
        }
    } else {
        return {
            user: Cookies.get("accessToken"),
            loading: false
        }
    } 
}

const logoutRequest = () => {
    Cookies.remove("accessToken")
}

const sendLoginRequest = async (username, password) => {
    let res = {
        title: 'Login Request',
        status : '',
        message : ''
    }
    console.log(username, password)
    await axios.post("https://cx-shield.herokuapp.com/api/user/login",{
        username,
        password,
        url: window.location.hostname
    })
    .then((response) => {
        console.log(response)
        var in5Minutes = 1/288
        Cookies.set("accessToken", response.data.accessToken, { expires: 7 });
        res.status = 'success'
        console.log(res)
        return res
    })
    .catch((error) => {
        console.log(error)
        return error
    })

    console.log(res)
    return res
}

const sendRegisterRequest = async (username, password, confirmPassword) => {
    await axios.post("https://cx-shield.herokuapp.com/api/user/create",{
        username,
        password,
        confirmPassword,
        returnUrl : window.location.href
    })
    .then((response) => {
        console.log('Yay Ran', response)

    })
    .catch (error => {
        console.log(error)
        throw new Error
    })
}

const sendRestRequest = async (username, password, confirmPassword) => {

}

export { sendLoginRequest, sendRegisterRequest, useUser, logoutRequest, checkDomain, checkPassword }