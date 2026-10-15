import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"

const cookiesOptions = {
    httpOnly: true,
    secure: true
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
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
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
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
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
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

