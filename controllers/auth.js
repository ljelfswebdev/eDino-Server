import User from "../models/user";
import {hashPassword, comparePassword} from "../helpers/auth";
import jwt from 'jsonwebtoken';



export const register = async (req,res) => {
    // console.log('Register endpoint =>', req.body);
    const {name, email, password} = req.body;
    // validation
    if(!name) {return res.json({error:'Name is required'});}
    if(!password || password.length < 6) {return res.json({error:'Password is required and should be 6 or more characters'});}
    const existEmail = await User.findOne({ email });
    if(existEmail)  {return res.json({error:'Email is taken'});}
    //hash password
    const hashedPassword = await hashPassword(password);

    const user = new User({name, email, password:hashedPassword});

    try {
        await user.save();
        return res.json({
            ok: true, 
        })

    } catch(err){
        console.log('Registration failed =>' , err);
        return res.status(400).send('Error. Try again');
    }
};

export const login = async (req, res) => {
    console.log(res.body)
    try{
        const  {email, password} = req.body;
        const user = await User.findOne({ email });
        if(!user)  {return res.json({error:'No User found'});}
        const match = await comparePassword(password, user.password);
        if(!match)  {return res.json({error:'Wrong password'});}
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
        user.password = undefined;
        user.secret = undefined;
        res.json({
            token, user,
        })
    } catch (err) {
        console.log(err)
        return res.status(400).send('Error. Try again.');
    }
};

export const currentUser = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        res.json({ok:true});
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
};

export const forgotPassword = async (req, res) => {
    const {email, newPassword, secret} = req.body;
    if(!newPassword || newPassword < 6){
        return res.json({
            error: 'New Password is required and should be a minimum of 6 characters long',
        });
    }
    if(!secret){
        return res.json({
            error: 'Secret is required',
        });
    }
    const user = await User.findOne({email, secret});
    if(!user) {
        return res.json({
            error: "We can't verify you with those details",
        });
    }
    try {
        const hashed = await hashPassword(newPassword);
        await User.findByIdAndUpdate(user._id, {password: hashed});
        return res.json ({
            success: 'Congratulations, Password successfully updated'
        })
    } catch (err) {
        return res.json({
            error: "Something went wrong. Try again"
        });
    }
};

// export const profileUpdate = async (req, res) => {
//     try{
//         const data = {};
        
//         if(req.body.username) {
//             data.username = req.body.username;
//         }
//         if(req.body.about) {
//             data.about = req.body.about;
//         }
//         if(req.body.name) {
//             data.name = req.body.name;
//         }
//         if(req.body.password) {
//             if(req.body.password.length < 6 ){
//                 return res.json({
//                     error: 'Password must be longer than 6 characters'
//                 });
//             } else {
//                 data.password = await hashPassword(req.body.password);
//             }          
//         }
//         if(req.body.secret) {
//             data.secret = req.body.secret;
//         }
//         if(req.body.image) {
//             data.image = req.body.image;
//         }

//         let user = await User.findByIdAndUpdate(req.user._id, data, {new: true});
//         // console.log(user)
//         user.password = undefined;
//         user.secret = undefined;
//         res.json(user);

//     } catch (err) {
//         if(err.code == 11000) {
//             return res.json({error: "Username is already taken"});
//         }
//         console.log(err);
//     }
// };


// export const findPeople = async (req,res) => {
//     try{
//         const user = await User.findById(req.user._id)

//         let following = user.following;
//         following.push(user._id);
        
//         const people = await User.find({_id: {$nin: following}}).select('-password -secret').limit(10);
//         res.json(people);
//     } catch (err){
//         console.log(err)
//     }
// };

// export const addFollower = async (req, res, next) => {
//     try{
//         const user = await User.findByIdAndUpdate(req.body._id, {
//             $addToSet: {followers: req.user._id}, 
//         });
//         next();
//     } catch (err){
//         console.log(err)
//     }
// };

// export const userFollow = async (req, res) => {
//     try{
//         const user = await User.findByIdAndUpdate(req.user._id, {
//             $addToSet: {following: req.body._id },
//         }, {new: true}).select('-password -secret');
//         res.json(user);
//     } catch (err){
//         console.log(err)
//     }
// };

// export const userFollowing = async (req, res) => {
//     try{
//         const user = await User.findById(req.user._id);
//         const following = await User.find({_id: user.following}).limit(100);
//         res.json(following);
//     } catch (err){
//         console.log(err)
//     }
// };

// export const removeFollower = async (req, res, next) => {
//     try{
//         const user = await User.findByIdAndUpdate(req.body._id, {
//             $pull: {followers: req.user._id}
//         });
//         next();
//     } catch (err){
//         console.log(err)
//     }
// };

// export const userUnfollow = async (req, res) => {
//     try{
//         const user = await User.findByIdAndUpdate(req.user._id, {
//             $pull: {following: req.body._id}
//             }, { new:true }
//         );
//         res.json(user);

//     } catch (err){
//         console.log(err)
//     }
// };

// export const searchUser = async (req, res) => {
//     const { query } = req.params;
//     if(!query) return;

//     try{
//         const user = await User.find({
//             $or: [
//                 {name:{$regex: query, $options: 'i'}},
//                 {username:{$regex: query, $options: 'i'}}
//             ]
//         }).select('-password -secret');
//         res.json(user);
//     } catch (err) {
//         console.log(err)
//     }
// };

// export const getUser = async (req,res) => {
//     try{
//         const user = await User.findOne({username: req.params.username}).select('-password -secret');
//         res.json(user);
//     }catch(err){
//         console.log(err)
//     }
// };