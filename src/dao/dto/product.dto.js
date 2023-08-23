export default class ProductDTO {
    static getProductInputFrom = (product) =>{
        return {
            title:product.title,
            description:product.description,
            price:product.price,
            status:product.status || false,
            thumbnail:product.thumbnail || [],
            code:product.code,
            stock:product.stock,
            category:product.category
        }
    }
}