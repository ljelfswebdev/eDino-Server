import express from "express";
import formidable from 'express-formidable';

const router = express.Router();

// middleware
import { requireSignin, isAdmin  } from "../middlewares";
// controllers
import { createProduct, uploadImage, fetchProducts, getProduct
    // , postsByUser, userPost, updatePost, newsFeed, deletePost, likePost, unlikePost, addComment, removeComment, totalPosts
} from "../controllers/product";

router.post("/create-product", requireSignin, createProduct);
router.post("/upload-image", requireSignin, formidable({maxFileSize: 5 * 1024 * 1024}), uploadImage );

// router.get('/user-posts', requireSignin, postsByUser);
// router.get('/user-post/:_id', requireSignin, userPost);

// router.put('/update-post/:_id', requireSignin, canEditDeletePost, updatePost);

// router.delete('/delete-post/:_id',requireSignin, canEditDeletePost, deletePost);


// router.get('/news-feed/:page', requireSignin, newsFeed);

// router.put('/like-post', requireSignin, likePost);
// router.put('/unlike-post', requireSignin, unlikePost);

// router.put('/add-comment', requireSignin, addComment);
// router.put('/remove-comment', requireSignin, removeComment);

// router.get('/total-posts', totalPosts);

router.get('/fetch-products', fetchProducts);

router.get('/product/:_id', getProduct);

// // admin
// router.delete("/admin/delete-post/:_id", requireSignin, isAdmin, deletePost);

module.exports = router;