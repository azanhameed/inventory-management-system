const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .populate('supplier')
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('supplier');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const { name, SKU, category, supplier, price, quantity, lowStockThreshold, description, image } = req.body;

    if (!name || !SKU || !category || !supplier || price === undefined) {
      return res.status(400).json({ message: 'Name, SKU, category, supplier, and price are required' });
    }

    // Check if SKU is unique
    const skuExists = await Product.findOne({ SKU: SKU.trim() });
    if (skuExists) {
      return res.status(400).json({ message: 'Product SKU already exists' });
    }

    const product = await Product.create({
      name: name.trim(),
      SKU: SKU.trim(),
      category,
      supplier,
      price,
      quantity: quantity !== undefined ? quantity : 0,
      lowStockThreshold: lowStockThreshold !== undefined ? lowStockThreshold : 10,
      description,
      image: image || ''
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category')
      .populate('supplier');

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res) => {
  try {
    const { name, SKU, category, supplier, price, quantity, lowStockThreshold, description, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (SKU) {
      // Check if SKU is in use by another product
      const skuExists = await Product.findOne({ SKU: SKU.trim(), _id: { $ne: req.params.id } });
      if (skuExists) {
        return res.status(400).json({ message: 'Product SKU already in use' });
      }
      product.SKU = SKU.trim();
    }

    if (name) product.name = name.trim();
    if (category) product.category = category;
    if (supplier) product.supplier = supplier;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;
    if (description !== undefined) product.description = description;
    if (image !== undefined) product.image = image;

    const updatedProduct = await product.save();
    
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('category')
      .populate('supplier');

    res.status(200).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update only product quantity
// @route   PATCH /api/products/:id/quantity
// @access  Public
const updateProductQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Valid quantity is required (cannot be negative)' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.quantity = quantity;
    const updatedProduct = await product.save();

    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('category')
      .populate('supplier');

    res.status(200).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload product image
// @route   POST /api/products/:id/image
// @access  Private
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.image = `/uploads/${req.file.filename}`;
    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('category')
      .populate('supplier');

    res.status(200).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductQuantity,
  deleteProduct,
  uploadProductImage
};
