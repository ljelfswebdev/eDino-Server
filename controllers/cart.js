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