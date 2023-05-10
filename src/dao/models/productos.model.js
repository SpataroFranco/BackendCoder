import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema({
    title:{
        type:String,
        require: true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require: true
    },
    status:{
        type:Boolean,
        require:true
    },
    thumbnail:{
        type:Array,
        require: true
    },
    code:{
        type:String,
        require:true,
        unique:true
    },
    stock:{
        type: Number,
        require: true
    }
})

const productoModel = mongoose.model(collection, schema);

export default productoModel;