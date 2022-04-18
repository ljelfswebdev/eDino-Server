import Product from "../models/product";
import cloudinary from 'cloudinary';
import User from '../models/user';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});


export const createProduct = async (req, res) => {
    //   console.log("post => ", req.body); 
    const { name, description, price, image } = req.body;
    if (!name.length) {return res.json({error: "Name is required",});}
    if (!description.length) {return res.json({error: "Description is required",});}
    if (!price.length) {return res.json({error: "Price is required",});}
    try {
      const product = new Product({name, description, price, image, postedBy: req.user._id});
      await product.save();
      const productWithUser = await Product.findById(product._id).populate('postedBy','-password -secret');
  
      res.json(productWithUser);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
}; 

export const uploadImage = async (req, res) => {

  try{
    const result = await cloudinary.uploader.upload(req.files.image.path);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    })
  } catch (err) {
    console.log(err);
  }

};

// export const postsByUser = async (req, res) => {
//   try{
//     const posts = await Post.find({postedBy: req.user._id})
//     // const posts = await Post.find()
//     .populate('postedBy', '_id name image')
//     .sort({createdAt: -1})
//     .limit(10);
//     res.json(posts);
//     console.log(posts)
//   } catch (err){
//     console.log(err);
//   }
// };

export const getProduct = async (req, res) => {
  try{
    const product = await Product.findById(req.params._id)
    .populate('postedBy', '_id name description price image' )

    res.json(product);
  } catch (err) {
    console.log(err)
  }
};

export const updateProduct = async (req,res) => {
  try{
    const product = await Product.findByIdAndUpdate(req.params._id, req.body, {
      new: true
    });
    res.json(product);
  } catch (err) {
    console.log(err)
  }
};

export const deleteProduct = async (req, res) => {
  try{
    const product = await Product.findByIdAndDelete(req.params._id);
    if(product.image && product.image.public_id) {
      const image = await cloudinary.uploader.destroy(product.image.public_id);
    }
    res.json({ok:true});
  } catch (err) {
    console.log(err) 
  }
};

// export const newsFeed = async (req, res) => {
//   try{
//     const user = await User.findById(req.user._id);
//     let following = user.following;
//     following.push(req.user._id);
//     // pagination
//     const currentPage = req.params.page || 1;
//     const perPage = 5; 

//     const posts = await Post.find({postedBy: {$in: following}})
//     .skip((currentPage - 1 ) * perPage)
//     .populate('postedBy', '_id name image' )
//     .populate('comments.postedBy', '_id name image')
//     .sort({createdAt: -1}).limit(perPage);
//     res.json(posts);

//   } catch (err) {
//     console.log(err)
//   }
// };

// export const likePost = async (req,res) => {
//   try{
//     const post = await Post.findByIdAndUpdate(req.body._id, {
//       $addToSet: {likes: req.user._id},
//     }, { new: true});
//     res.json(post);
//   } catch(err){
//     console.log(err)
//   }
// };

// export const unlikePost = async (req,res) => {
//   try{
//     const post = await Post.findByIdAndUpdate(req.body._id, {
//       $pull: {likes: req.user._id},
//     }, { new: true});
//     res.json(post);
//   } catch(err){
//     console.log(err)
//   }
// };

// export const addComment = async (req, res) => {
//   try {
//     const {postId, comment} = req.body;
//     const post = await Post.findByIdAndUpdate(postId, {
//       $push: {comments: { text: comment, postedBy: req.user._id}}
//     },
//     {new: true}
//     )
//     .populate('postedBy', '_id name image' )
//     .populate('comments.postedBy', '_id name image');
//     res.json(post);
//   } catch (err) {
//     console.log(err)
//   }
// };

// export const removeComment = async (req, res) => {
//   try {
//     const {postId, comment} = req.body;
//     const post = await Post.findByIdAndUpdate(postId, {
//       $pull: {comments: { _id: comment._id }}
//     },
//     {new: true}
//     )
//     res.json(post);
//   } catch (err) {
//     console.log(err)
//   }
// };

// export const totalPosts = async (req, res) => {
//   try {
//     const total = await Post.find().estimatedDocumentCount();
//     res.json(total);

//   } catch (err) {
//     console.log(err)
//   }
// };

export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("postedBy", "_id name image price description")
      .sort({ createdAt: -1 })
      .limit(12);
    res.json(products);
  } catch (err) {
    console.log(err);
  }
};