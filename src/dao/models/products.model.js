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
        index: true
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
    }
})

schema.plugin(mongoosePaginate);
const productoModel = mongoose.model(collection, schema);

export default productoModel;