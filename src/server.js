import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import path from "path";
import { fileURLToPath } from "url";
import sessionsRouter from './routers/sessions.router.js';
import productsRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';
import purchaseRouter from './routers/purchase.router.js';
import { initializePassport } from './config/passport.config.js';
import { MONGO_URL, PORT } from './config/config.js';
import { engine } from 'express-handlebars';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsPath = path.join(__dirname, "views");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars (front server-side)
app.engine("hbs", engine({ extname: "hbs" }));
app.set("view engine", "hbs");
app.set("views", viewsPath);

// Passport
initializePassport();
app.use(passport.initialize());

// Routes
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/purchase', purchaseRouter);

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



