import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import sessionsRouter from './routers/sessions.router.js';
import { initializePassport } from './config/passport.config.js';
import { MONGO_URL, PORT } from './config/config.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
initializePassport();
app.use(passport.initialize());

// Routes
app.use('/api/sessions', sessionsRouter);

// Conexión a Mongo y arranque del servidor
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });



