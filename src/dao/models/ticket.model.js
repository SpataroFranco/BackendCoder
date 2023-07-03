import mongoose from "mongoose";

const collection = "tickets";

const schema = new mongoose.Schema({
    code:{
        type: String,
        require: true,
        unique: true
    },
    purchase_datetime:{
        type: String
    },
    amount:{
        type:Number
    },
    purchaser:{
        type:String
    }
})

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;