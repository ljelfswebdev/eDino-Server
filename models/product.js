import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name : {
        type: {},
        required: true,
    },
    postedBy: {
        type: ObjectId,
        ref: "User",
    },
    description : {
        type: {},
        required: true,
    },
    price : {
        type: {},
        required: true
    },
    image: {
        url: String,
        public_id: String,
    },
    
}, {timestamps: true}
);


export default mongoose.model('Product', productSchema);