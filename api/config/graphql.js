const {buildSchema} = require('graphql')
const productsApi = require('../containers/productsDto')
const logger = require('../config/logger').logger
const errorLogger = require('../config/errorLogger').errorLogger

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const schema = buildSchema(`
type Product {
    _id: String,
 	title: String,
    price: Int,
    thumbnail: String,
    _v: Int
},
input ProductInput{
    title: String, 
    price: Int, 
    thumbnail: String
}
type Query {
	getProducts: [Product]
}
type Mutation {
    saveProduct (title:String,price:Int, thumbnail:String): Product
    updateProduct (_id:String,title:String,price:Int, thumbnail:String): Product
    deleteProduct (_id:String): Product

}
`);



const saveProduct = async ({title, price, thumbnail}) =>{
    let newProduct = {title,price,thumbnail}

    if(newProduct.title === "" || newProduct.thumbnail === "" || newProduct.price === ""){
        errorLogger.error('Error al añadir producto')
        return
    }
    productsApi.push(newProduct);
    
    return newProduct
}

const getProducts = async () =>{
    let savedProducts = await productsApi.getAll()
    return savedProducts
}

const updateProduct = async ({_id,title, price, thumbnail}) =>{
    let newProduct = {title, price, thumbnail}
    if(!isNumeric(newProduct.price)){
        return({"error":"Ingrese un precio o stock válido"})
    }
    newProduct.price = Number(newProduct.price);
    newProduct = await productsApi.update(_id,newProduct)
    if(!newProduct){
        return({"error":"No se encuentra el producto"})
    }
    return(newProduct);
}

const deleteProduct = async (_id) =>{
    if(!(productsApi.get(_id))){
        return({"error":"No se encuentra el producto"})
    }
    let erasedProduct = await productsApi.delete(_id);
    return(erasedProduct);
}

const resolvers = {
	saveProduct,
	getProducts,
	updateProduct,
    deleteProduct
};














module.exports = {schema,resolvers}