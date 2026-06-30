import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Wishlist from './models/Wishlist.js';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to database...');
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to Atlas MongoDB!');
    } catch (err) {
      console.log('Failed to connect to Atlas. Trying local MongoDB fallback...');
      await mongoose.connect('mongodb://127.0.0.1:27017/styleai');
      console.log('Connected to Local MongoDB!');
    }

    const users = await User.find({}).select('name email provider').lean();
    console.log(`Found ${users.length} users:`);
    console.log(JSON.stringify(users, null, 2));

    const wishlists = await Wishlist.find({}).lean();
    console.log(`Found ${wishlists.length} raw wishlist items:`);
    console.log(JSON.stringify(wishlists, null, 2));

  } catch (error) {
    console.error('Error running test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
