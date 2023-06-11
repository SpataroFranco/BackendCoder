import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "User";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  age: {
    type: Number,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  rol: {
    type: String,
    require: true,
    default: "user",
  },
  cart: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      }
    ],
    default: [],
  },
});

schema.pre("find", function () {
  this.populate("cart.cart");
});

schema.plugin(mongoosePaginate);
const userModel = mongoose.model(collection, schema);

export default userModel;
