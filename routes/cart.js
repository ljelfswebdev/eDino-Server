import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

// middleware
import { requireSignin, canEditDeleteProduct, isAdmin  } from "../middlewares";
// controllers
import {addToCart} from "../controllers/cart";


router.post("/add-to-cart", addToCart, requireSignin);

module.exports = router;