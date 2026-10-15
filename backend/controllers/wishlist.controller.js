import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";


export const getSingleWishlist = async (req, res) => {
    try {
        const productId = req.params.productId

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const customerId = req.customer._id

        const customer = await Customer.findById(customerId)

        const alreadyWishlisted = customer.wishlist.some((id) => id.toString() === productId.toString())

        if (alreadyWishlisted) {
            // customer.wishlist.pull(productId)
            // await customer.save()
            return res.status(409).json({ message: 'Already in wishlist' })
        } else {
            customer.wishlist.push(productId)
        }

        await customer.save()

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
        });


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const customerId = req.customer._id;

        const customer = await Customer.findById(customerId).populate({
            path: "wishlist",
            select: "name description price category image stock"
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const wishlist = customer.wishlist || [];

        res.status(200).json({
            success: true,
            count: wishlist.length,
            wishlist: wishlist
        });


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

export const deleteWishlist = async (req, res) => {
    try {
        const productId = req.params.productId

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        const customerId = req.customer._id

        const customer = await Customer.findById(customerId)

        const alreadyWishlisted = customer.wishlist.some((id) => id.toString() === productId.toString())

        if (!alreadyWishlisted) {
            return res.status(409).json({ message: 'Product is not wishlist' })
        }

        customer.wishlist.pull(productId)

        await customer.save()

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}
