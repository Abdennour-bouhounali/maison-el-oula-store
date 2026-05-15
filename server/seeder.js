const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config({ path: './server/.env' });

connectDB();

const sampleProducts = [
  {
    name: {
      fr: 'Poudre de Citron Séché',
      en: 'Dried Lemon Powder',
      ar: 'مسحوق الليمون المجفف'
    },
    description: {
      fr: 'Pur citron séché, idéal pour vos boissons et pâtisseries.',
      en: 'Pure dried lemon, ideal for your drinks and pastries.',
      ar: 'ليمون مجفف نقي ، مثالي لمشروباتك وحلوياتك.'
    },
    images: ['/uploads/lemon.png'],
    category: 'Citrus',
    price: 950,
    countInStock: 50,
    weight: '100g',
    slug: 'poudre-citron',
    ingredients: { fr: '100% Citron' },
    usage_instructions: { fr: 'Ajouter une cuillère à café dans votre thé ou gâteau.' }
  },
  {
    name: {
      fr: 'Poudre d\'Orange Séchée',
      en: 'Dried Orange Powder',
      ar: 'مسحوق البرتقال المجفف'
    },
    description: {
      fr: 'Une explosion de saveurs fruitées pour sublimer vos desserts.',
      en: 'An explosion of fruity flavors to enhance your desserts.',
      ar: 'انفجار من نكهات الفواكه لتعزيز الحلويات الخاصة بك.'
    },
    images: ['/uploads/orange.png'],
    category: 'Citrus',
    price: 950,
    countInStock: 30,
    weight: '100g',
    slug: 'poudre-orange',
    ingredients: { fr: '100% Orange' },
    usage_instructions: { fr: 'Idéal pour les marinades et les zestes de gâteaux.' }
  },
  {
    name: {
      fr: 'Poudre de Menthe Séchée',
      en: 'Dried Mint Powder',
      ar: 'مسحوق النعناع المجفف'
    },
    description: {
      fr: 'La fraîcheur du jardin capturée dans une poudre fine.',
      en: 'Garden freshness captured in a fine powder.',
      ar: 'نضارة الحديقة مأخوذة في مسحوق ناعم.'
    },
    images: ['/uploads/mint.png'],
    category: 'Herbs',
    price: 850,
    countInStock: 10,
    weight: '50g',
    slug: 'poudre-menthe',
    ingredients: { fr: '100% Menthe Poivrée' },
    usage_instructions: { fr: 'Parfait pour le thé à la menthe instantané.' }
  },
  {
    name: {
      fr: 'Poudre d\'Ail Séché',
      en: 'Dried Garlic Powder',
      ar: 'مسحوق الثوم المجفف'
    },
    description: {
      fr: 'Intensité et praticité pour vos plats cuisinés.',
      en: 'Intensity and practicality for your cooked dishes.',
      ar: 'الكثافة والعملية لأطباقك المطبوخة.'
    },
    images: ['/uploads/garlic.png'],
    category: 'Spices',
    price: 750,
    countInStock: 4,
    weight: '100g',
    slug: 'poudre-ail',
    ingredients: { fr: '100% Ail' },
    usage_instructions: { fr: 'Une pincée suffit pour relever vos sauces.' }
  },
  {
    name: {
      fr: 'Poudre d\'Oignon Séché',
      en: 'Dried Onion Powder',
      ar: 'مسحوق البصل المجفف'
    },
    description: {
      fr: 'Une base aromatique indispensable pour toutes vos recettes.',
      en: 'An essential aromatic base for all your recipes.',
      ar: 'قاعدة عطرية أساسية لجميع وصفاتك.'
    },
    images: ['/uploads/onion.png'],
    category: 'Spices',
    price: 750,
    countInStock: 100,
    weight: '100g',
    slug: 'poudre-oignon',
    ingredients: { fr: '100% Oignon' },
    usage_instructions: { fr: 'Sublime vos soupes et bouillons.' }
  }
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUser = await User.create({
      name: 'Admin User',
      email: 'admin@oula.dz',
      password: 'password123', // Will be hashed by model pre-save
      role: 'admin',
    });


    const products = sampleProducts.map((p) => ({ ...p, user: createdUser._id }));
    const createdProducts = await Product.insertMany(products);

    // Create Sample Order
    await Order.create({
      user: createdUser._id,
      shippingAddress: {
        fullName: 'Jane Doe',
        phone: '0550123456',
        email: 'jane@example.com',
        wilaya: 'Alger',
        address: '123 Rue de la Liberté',
      },
      orderItems: [
        {
          name: createdProducts[0].name.fr,
          qty: 2,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          product: createdProducts[0]._id,
        }
      ],
      itemsPrice: createdProducts[0].price * 2,
      shippingPrice: 600,
      totalPrice: (createdProducts[0].price * 2) + 600,
      status: 'Pending',
    });

    console.log('Données importées avec succès !');
    process.exit();
  } catch (error) {
    console.error(`Erreur : ${error.message}`);
    process.exit(1);
  }
};

importData();
