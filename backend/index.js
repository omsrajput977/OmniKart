import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from './routes/customer.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import productRoutes from './routes/product.routes.js'
import wishlistRoutes from './routes/wishlist.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'

const app = express()

dotenv.config()

const PORT = process.env.PORT || 8085

mongoose.connect(process.env.dbUrl).then(() => {
    console.log("DB connected!!!")
}).catch((error) => {
    console.log(error)
})

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true)
        if (
            allowedOrigins.includes(origin) ||
            process.env.NODE_ENV !== 'production' ||
            origin.endsWith('.onrender.com') ||
            origin.endsWith('.vercel.app')
        ) {
            return callback(null, true)
        }
        return callback(null, true)
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// Health check endpoint for deployment diagnostics
app.get('/health', (req, res) => {
    const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown'
    res.json({
        status: 'ok',
        database: dbState,
        hasDbUrl: Boolean(process.env.dbUrl),
        hasJwtSecret: Boolean(process.env.JWT_SECRET),
        nodeEnv: process.env.NODE_ENV || 'development'
    })
})

app.use('/customers', customerRoutes)
app.use('/products', productRoutes)
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)


app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})
