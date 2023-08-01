import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const schema = new mongoose.Schema({
    title:{
        type:String,
        require: true,
    },
    description:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require: true,
        index: true,
        min:1
    },
    status:{
        type:Boolean,
        require:true,
        index: true
    },
    thumbnail:{
        type:Array,
        require: true,
        default: []
    },
    code:{
        type:String,
        require:true,
        unique:true,
    },
    stock:{
        type: Number,
        require: true,
        index: true
    },
    category:{
        type: String,
        require: true,
        index: true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

schema.plugin(mongoosePaginate);
const productoModel = mongoose.model(collection, schema);

export default productoModel;