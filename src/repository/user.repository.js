import {CreateUserDto, GetUserDto} from "../dao/dto/user.dto.js";

export class UserRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getUser({ email: username }){
        const user = await this.dao.get({ email: username });
        return user;
    }

    async getUserById(id){
        const user = await this.dao.getId(id);
        return user;
    }

    async createUser(user){
        const userDto = new CreateUserDto(user);
        const userCreated = await this.dao.post(userDto);
        return userCreated;
    }

    async updatePassword(user, newHashedPassword){
        return await this.dao.put(user, newHashedPassword);
    }

    async updateUser(uemail, newUser){
        return await this.dao.update(uemail, newUser);
    }

    // async getCart(){
    //     const user = new GetUserDto();
    //     return await this.dao.getCart(user.email);
    // }
}