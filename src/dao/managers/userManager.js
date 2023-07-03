import userModel from "../models/user.model.js";

class UserManager {
  constructor() {
    this.model = userModel;
  }

  async get({ email: username }) {
    try {
      return this.model.findOne({ email: username });
    } catch (error) {
      console.log(error);
    }
  }

  async getId(id) {
    try {
      return this.model.findById(id);
    } catch (error) {
      console.log(error);
    }
  }

  async post(user) {
    try {
      await this.model.create(user);
    } catch (error) {
      console.log(error);
    }
  }

  async put(user, newHashedPassword) {
    try {
      await this.model.updateOne(
        { _id: user._id },
        { $set: { password: newHashedPassword } }
      );
    } catch (error) {
      console.log(error);
    }
  }

  async update(uemail, newUser) {
    try {
      await this.model.updateOne({ email: uemail }, { $set: newUser });
    } catch (error) {
      console.log(error);
    }
  }

  // async getCart(email) {
  //   try {
  //     await this.model
  //       .findOne({ email: email })
  //       .populate("cart.cart")
  //       .lean();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}

export default UserManager;
