import express from 'express'
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { createCart, deleteCart, editCart, getCart } from '../controllers/cart.controllers.js'

const cartRoutes = express.Router()

cartRoutes.post('/:productId', isAuthenticated, createCart)

cartRoutes.get('/', isAuthenticated, getCart)

cartRoutes.patch('/:productId', isAuthenticated, editCart)

cartRoutes.delete('/:productId', isAuthenticated, deleteCart)


export default cartRoutes
