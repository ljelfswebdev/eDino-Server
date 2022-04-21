import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

// middleware
import { requireSignin, canEditDeleteProduct, isAdmin  } from "../middlewares";
// controllers
import {addToCart, fetchCart} from "../controllers/cart";


router.post("/add-to-cart", requireSignin, addToCart);
router.get('/fetch-cart', requireSignin, fetchCart);

module.exports = router;