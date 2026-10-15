import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";


export const createCart = async (req, res) => {
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

        const existingCartItem = customer.cart.find(
            (item) => item.product.toString() === productId.toString()
        );

        const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;

        if (product.stock < currentCartQty + 1) {
            return res.status(400).json({
                message: "Requested quantity exceeds available stock"
            });
        }

        if (existingCartItem) {
            customer.cart = customer.cart.map((item) =>
                item.product.toString() === productId.toString()
                    ? { ...item.toObject(), quantity: item.quantity + 1 }
                    : item
            );
        } else {
            customer.cart = [...customer.cart, { product: productId, quantity: 1 }];
        }

        await customer.save();
        await customer.populate({
            path: "cart.product",
            select: "name description price category image stock"
        });

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart: customer.cart
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

export const getCart = async (req, res) => {
    try {
        const customerId = req.customer._id;

        const customer = await Customer.findById(customerId).populate({
            path: "cart.product",
            select: "name description price category image stock"
        });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const cart = customer.cart || [];

        res.status(200).json({
            success: true,
            count: customer.cart.reduce((prev, item) => prev + item.quantity, 0),
            cart: cart
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

export const editCart = async (req, res) => {
    try {
        const { quantity } = req.body

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

        const existingCartItem = customer.cart.find(
            (item) => item.product.toString() === productId.toString()
        );

        // const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;

        if (!existingCartItem) {
            return res.status(404).json({ message: 'Product not in cart' })
        }

        if (quantity > product.stock) {
            return res.status(400).json({ message: 'Quantity must not exceed Product stock' })
        }

        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be atleast 1' })
        }

        customer.cart = customer.cart.map((item) =>
            item.product.toString() === productId.toString()
                ? { ...item.toObject(), quantity: quantity }
                : item
        );

        await customer.save();
        await customer.populate({
            path: "cart.product",
            select: "name description price category image stock"
        });

        res.status(200).json({
            success: true,
            message: "Product updated in cart",
            cart: customer.cart
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

export const deleteCart = async (req, res) => {
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

        const existingCartItem = customer.cart.find(
            (item) => item.product.toString() === productId.toString()
        );

        if (!existingCartItem) {
            return res.status(409).json({ message: 'Product is not in cart' })
        }

        customer.cart.pull(existingCartItem)

        await customer.save();
        await customer.populate({
            path: "cart.product",
            select: "name description price category image stock"
        });

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: customer.cart
        });

        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}

