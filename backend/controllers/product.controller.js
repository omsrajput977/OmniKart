import Product from "../models/product.model.js";
import mongoose from "mongoose";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body

        let image;

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(req.file.buffer)
            image = uploadedImage.secure_url
        }

        if (!name || !description || !price || !category || !image || !stock) {
            return res.status(400).json({ message: "Please fill all fields" })
        }

        if (price <= 0) {
            return res.status(400).json({ message: "Price must be grater than 0" })
        }

        if (stock < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" })
        }


        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        })

        res.status(201).json({
            success: true,
            message: "Product registered successfully",
            product: newProduct
        })


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error })
    }
}

export const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        const query = {};

        // Search by product name
        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product: product
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Errorr', error: error })
    }
}
