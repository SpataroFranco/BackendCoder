import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema({
    products:{
        type:[
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity:{
                    type:Number,
                    require: true,
                    default: 1
                },
            }
        ],
        default: []
    }
})

schema.pre("find", function(){
    this.populate("products.product");
})

const cartModel = mongoose.model(collection, schema);

export default cartModel;