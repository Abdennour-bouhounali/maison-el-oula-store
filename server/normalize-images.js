const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const normalizeImages = async () => {
  try {
    await connectDB();

    const products = await Product.find({});
    console.log(`Found ${products.length} products to check.`);

    for (let product of products) {
      let updated = false;

      // Ensure images is an array
      if (!Array.isArray(product.images)) {
        product.images = [];
        updated = true;
      }

      // Process each image path
      const cleanedImages = product.images.map(img => {
        if (!img) return null;
        
        let newPath = img;
        
        // Remove hostname if present
        if (newPath.includes('http://localhost:5000')) {
          newPath = newPath.replace('http://localhost:5000', '');
          updated = true;
        }

        // Fix missing leading slash
        if (newPath.startsWith('uploads/')) {
          newPath = '/' + newPath;
          updated = true;
        }

        return newPath;
      }).filter(img => img !== null);

      if (updated || JSON.stringify(cleanedImages) !== JSON.stringify(product.images)) {
        product.images = cleanedImages;
        await product.save();
        console.log(`Normalized images for product: ${product.name.fr}`);
      }
    }

    console.log('Database image normalization complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

normalizeImages();
