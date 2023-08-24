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
    required: true,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: {
    type: [
      {
        cart: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "carts",
        },
      },
    ],
    default: [],
  },
  documents: {
    type: [
      {
        name: { type: String, required: true },
        reference: { type: String, required: true },
      },
    ],
    default: [],
  },
  last_connection: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    require: true,
    enums: ["completo", "incompleto", "pendiente"],
    default: "pendiente",
  },
  avatar: {
    type: String,
    default: "",
  },
});

schema.pre("find", function () {
  this.populate("cart.cart");
});

schema.plugin(mongoosePaginate);
const userModel = mongoose.model(collection, schema);

export default userModel;
