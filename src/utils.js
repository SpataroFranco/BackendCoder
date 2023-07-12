import { fileURLToPath} from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { Faker, en } from "@faker-js/faker";

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, user) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const customFaker = new Faker({
    locale: [en]
})

const {commerce,image,database,datatype,lorem,string} = customFaker;

const generateProduct = () => {
    return{
        _id: database.mongodbObjectId(),
        title: commerce.productName(),
        description: lorem.lines(1),
        price: parseFloat(commerce.price()),
        status:datatype.boolean,
        thumbnail:image.url(),
        code:string.alphanumeric(6),
        stock:parseInt(string.numeric(2)),
        category:commerce.department(),
    }
}

export const generateMocking = () => {
    let products = [];
    for (let i = 0; i < 100; i++) {
        const product = generateProduct();
        products.push(product);    
    }
    return products;
}