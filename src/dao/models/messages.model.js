import mongoose from "mongoose";

const collection = "messages";

const schema = new mongoose.Schema({
    user:{
        type:String,
        require: true
    },
    message:{
        type:String,
        require:true
    },
})

const mensajeModel = mongoose.model(collection, schema);

export default mensajeModel;