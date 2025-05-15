require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Product = require('./models/Product');

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('> Підключено до MongoDB для сидування (cosmetics)');

    await Product.deleteMany({});
    await User.deleteMany({});

    const sampleProducts = [
      {
        name: 'Foundation Moisture',
        description: 'Зволожуючий тональний крем',
        price: 30,
        category: 'foundation',
        imagePath: ''
      },
      {
        name: 'Lipstick Rose',
        description: 'Помада рожевого відтінку',
        price: 15,
        category: 'lipstick',
        imagePath: ''
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('> Тестові товари додано');

    const hashedPass = await bcrypt.hash('admin1234', 10);
    const adminUser = new User({ login: 'adminUser', password: hashedPass, role: 'admin' });
    await adminUser.save();
    console.log('> Адмін: login=adminUser, pass=admin1234');

    process.exit();
  } catch (error) {
    console.error('Помилка seed:', error);
    process.exit(1);
  }
}

seedDB();
