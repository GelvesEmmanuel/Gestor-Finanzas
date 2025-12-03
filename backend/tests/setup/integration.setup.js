// tests/setup/integration.setup.js
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectMongoMemory = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const disconnectMongoMemory = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};