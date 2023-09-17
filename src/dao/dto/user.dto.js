export class CreateUserDto {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.password = user.password;
    this.rol = user.rol;
    this.cart = user.cart;
    this.category = user.category;
  }
}

export class GetUserDto {
  constructor(userDB) {
    this.first_name = userDB.first_name;
    this.last_name = userDB.last_name;
    this.email = userDB.email;
    this.rol = userDB.rol;
  }
}

export default class GetUserDTO {
  static getUserDTO = (user) =>{
      return {
          _id:user._id,
          first_name:user.first_name,
          last_name:user.last_name,
          email: user.email,
          rol: user.rol
      }
  }
}