import express from 'express'
import { getCustomer, loginCustomer, logoutCustomer, registerCustomer } from '../controllers/customer.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { createProduct, getProducts, getSingleProduct } from '../controllers/product.controller.js'
import upload from '../middlewares/upload.middleware.js'

const productRoutes = express.Router()

productRoutes.post('/', isAuthenticated, upload.single('image'), createProduct)

productRoutes.get('/', isAuthenticated, getProducts)

productRoutes.get('/:id', isAuthenticated, getSingleProduct)


export default productRoutes
