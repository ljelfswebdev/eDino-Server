import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

// middleware
import { requireSignin, isAdmin  } from "../middlewares";
// controllers
import {addToCart, fetchCart, removeProduct} from "../controllers/cart";


router.post("/add-to-cart", requireSignin, addToCart);
router.get('/fetch-cart', requireSignin, fetchCart);

router.delete('/remove-product/:_id', requireSignin, removeProduct);

module.exports = router; 