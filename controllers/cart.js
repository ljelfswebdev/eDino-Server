import Cart from "../models/cart";

export const addToCart = async (req, res) => {
    //   console.log("post => ", req.body);
    const { name, price } = req.body; 
    try {
      const cart = new Cart({name, price, postedBy: req.user._id});
      await cart.save();
      const cartWithUser = await Cart.findById(cart._id).populate('postedBy','-password -secret');
  
      res.json(cartWithUser);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
};  

export const fetchCart = async (req,res) => {
    try{
    const cart = await Cart.find({postedBy: req.user._id})
    // const posts = await Post.find()
    // .populate('postedBy', '_id name image')
    .sort({createdAt: -1})
    // .limit(10);
    res.json(cart);
  } catch (err){
    console.log(err);
  }
}

export const removeProduct = async (req, res) => {
  try{
    const cart = await Cart.findByIdAndDelete(req.params._id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err) 
  }
};