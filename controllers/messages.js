const nodemailer = require('nodemailer')
require('dotenv').config()
const twilio = require('twilio')
const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
        user: process.env.NODEMAILER_MAIL,
        pass: process.env.NODEMAILER_PASS
    }
});

const client = twilio(process.env.TWILIO_TOKEN,process.env.TWILIO_PASS)
const sendBuyMailandMessage = async (user) =>{
    let orderString = '';
    let twilioString = ``;
    console.log(user.cart.products)
    user.cart.products.forEach(product => {
        orderString += `<div>Producto: ${product.title} Precio: ${product.price}</div><br>`
        twilioString += `Producto: ${product.title} Precio: ${product.price} 
        `
    });
    orderString += `<br> Total de la compra:${user.cart.total}`
    twilioString += `Total de la compra:${user.cart.total}`
    const mailOptions = {
        from: 'Servidor Node.js',
        to: process.env.NODEMAILER_MAIL,
        subject: 'Nuevo pedido de ' + user.name,
        html: orderString
     }
     const twilioOptions = {
        body: 'Nuevo pedido de ' + user.name + ' ' + twilioString,
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+5491140238224'
     }
     
     try {
        const info = await transporter.sendMail(mailOptions)
        await client.messages.create(twilioOptions)
        console.log(info)
     } catch (error) {
        console.log(error)
     }
     
     
}

module.exports = {sendBuyMailandMessage}