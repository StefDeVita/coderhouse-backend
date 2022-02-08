const { faker } = require('@faker-js/faker');

const createProducts = () =>{
    let products = [];
    for(let i = 0; i < 15;i++){
        const newProduct = {
            title: faker.commerce.product(),
            price: faker.commerce.price(5,100),
            thumbnail: faker.image.image()
        }
        products.push(newProduct);
    }
    return products;
}

module.exports = createProducts();