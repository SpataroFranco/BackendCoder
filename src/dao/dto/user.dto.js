export class CreateUserDto {
    constructor(user){
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.rol = user.rol;
        this.cart = user.cart;
    }
}

export class GetUserDto {
    constructor(userDB){
        this.nombreCompleto = userDB.first_name+" "+userDB.last_name;
        this.email = userDB.email;
        this.age = userDB.age;
        this.rol = userDB.rol;
        this.cart = userDB.cart;
    }
}