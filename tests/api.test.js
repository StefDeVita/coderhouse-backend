const request = require('supertest')('http://localhost:8080')
const expect = require('chai').expect
const generatedProducts = require('./testProducts')



describe('test api products',()=>{
    describe('GET',() =>{
        it('it should return products',async () =>{
            let response = await request.get('/products')
            expect(response.status).to.eql(200)
        })
    })
    describe('POST',() =>{
        it('should add a product',async () =>{
            let product = generatedProducts[0]
            let response = await request.post('/products').type('form').send(product)
            //El codigo es 302 ya que redirecciona
            expect(response.status).to.eql(302)

        })
    })
    describe('PUT',() =>{
        it('should update a product',async () =>{
            let newProduct = generatedProducts[2]
            let getResponse = await request.get('/products')
            let products = getResponse.body
            let randomProduct = products.payload[0]
            let id = randomProduct._id
            let response = await request.put(`/products/${id}`).type('form').send(newProduct)
            expect(response.status).to.eql(200)
            const savedProduct = response.body.payload
            expect(savedProduct.price).to.eql(newProduct.price)
            expect(savedProduct.title).to.eql(newProduct.title)
            expect(savedProduct.thumbnail).to.eql(newProduct.thumbnail)
        })
    })
    describe('DELETE',() =>{
        it('should delete a product',async () => {
            let getResponse = await request.get('/products')
            let products = getResponse.body
            let randomProduct = products.payload[0]
            let id = randomProduct._id
            let response = await request.delete(`/products/${id}`)
            expect(response.status).to.eql(200)
            
        }
        )})
})
        
