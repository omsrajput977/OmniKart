import express from 'express'
import { deleteWishlist, getSingleWishlist, getWishlist } from '../controllers/wishlist.controller.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const wishlistRoutes = express.Router()

wishlistRoutes.post('/:productId', isAuthenticated, getSingleWishlist)

wishlistRoutes.get('/', isAuthenticated, getWishlist)

wishlistRoutes.delete('/:productId', isAuthenticated, deleteWishlist)


export default wishlistRoutes
