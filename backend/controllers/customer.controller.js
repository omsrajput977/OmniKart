import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"

const isProduction = process.env.NODE_ENV === 'production'

const cookiesOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
}

export const registerCustomer = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: "Please fill all fields" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password needs atleast 6 characters" })
        }

        const customerEmail = await Customer.findOne({ email })

        if (customerEmail) {
            return res.status(409).json({ message: "Email already exists" })
        }

        // Password Hashing
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newCustomer = await Customer.create({
            fullName,
            email,
            password: hashedPassword,
            phone
        })


        // JWT token
        const token = genToken(newCustomer._id)
        res.cookie('token', token, cookiesOptions)


        res.status(201).json({
            "success": true,
            "message": "Customer registered successfully",
            "customer": newCustomer
        })


    } catch (error) {
        console.error('Registration Error:', error)
        res.status(500).json({ message: 'Internal Server Error', error: error.message || error.toString() })
    }
}

export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body

        const customer = await Customer.findOne({ email })

        if (!customer) {
            return res.status(401).json({ message: "User Not Exists" })
        }

        const passwordCheck = await bcrypt.compare(password, customer.password)

        if (!passwordCheck) {
            return res.status(401).json({ message: "Wrong Password" })
        }

        // JWT token
        const token = genToken(customer._id)
        res.cookie('token', token, cookiesOptions)

        res.status(200).json({
            "success": true,
            "message": "Login successful",
            customerData: customer
        })

    } catch (error) {
        console.error('Login Error:', error)
        res.status(500).json({ message: 'Internal Server Error', error: error.message || error.toString() })
    }
}

export const getCustomer = (req, res) => {
    res.status(200).json({ message: "User Authenticated", customerData: req.customer })
}

export const logoutCustomer = async (req, res) => {
    try {
        const { email, password } = req.customer

        const customerEmail = await Customer.findOne({ email })

        if (!customerEmail) {
            return res.status(404).json({ message: "Customer Not Found Please Register" })
        }

        res.clearCookie("token", cookiesOptions)

        res.status(200).json({
            "success": true,
            "message": "Logged out successfully"
        })

    } catch (error) {
        console.error('Logout Error:', error)
        res.status(500).json({ message: 'Internal Server Error', error: error.message || error.toString() })
    }
}

