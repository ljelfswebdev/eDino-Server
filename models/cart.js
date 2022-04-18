import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema;

const cartSchema = new mongoose.Schema({
    name : {
        type: {},
        required: true,
    },
    postedBy: {
        type: ObjectId,
        ref: "User",
    },
    price : {
        type: {},
        required: true
    },
    
}, {timestamps: true}
);


export default mongoose.model('Cart', cartSchema);