import express from 'express'
import { getCustomer, loginCustomer, logoutCustomer, registerCustomer } from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const customerRoutes = express.Router()

customerRoutes.post('/register', registerCustomer)

customerRoutes.post('/login', loginCustomer)

customerRoutes.get('/me', isAuthenticated, getCustomer)

customerRoutes.get('/logout', isAuthenticated, logoutCustomer)



export default customerRoutes
