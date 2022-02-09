const socket = io.connect();
const author = new normalizr.schema.Entity('authors')

const messageSchema = new normalizr.schema.Entity('messages',{
    id: author
})

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const validarEntrada = () => {
    let precio = document.getElementById("price").value;
    if (!isNumeric(precio)) {
        document.getElementById("send").disabled = true;
    } else {
        document.getElementById("send").disabled = false;
    }
}

function addMessage(e) {
    let date = new Date();
    let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    const message = {
        author:{
            _id: document.getElementById('username').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
            date: formattedDate
        },
        text: document.getElementById('message-text').value
    };
    socket.emit('new-message', message);
    return false;
}
const render = (products) => {
    if (products.length === 0) {
        document.getElementById('table-container').innerHTML = `<h3 class="alert alert-danger">no se encontraron productos</h3>`;
        return;
    }
    document.getElementById('table-container').innerHTML = `<table id="table" class="table table-dark">
        <tr><th>Nombre</th> <th>Precio</th> <th>Imagen</th> </tr>`;

    let html = products.map(function (product, index) {
        return (`<tr>
    <td>${product.title}</td>
    <td>${product.price}</td> 
    <td><img class="img-responsive" src="${product.thumbnail}" alt="${product.title}"></td>
    </tr>`)
    }).join("");
    document.getElementById('table').innerHTML += html;

}
const messageRender = (normalizedMessages) => {
    const messages = normalizr.denormalize(normalizedMessages.result,messageSchema,normalizedMessages.entities)
    if (messages.length === 0) {
        document.getElementById('message-container').innerHTML = `<h3 class="alert alert-danger">no se encontraron mensajes</h3>`;
        return;
    }
    let html = Object.values(messages).map(function (message, index) {
        if(message === undefined){
            return;
        }
        return (`<div class="flex">
            <div class="d-flex">
            <p class="author">${message.author[0]._id}</p>
            <p class="date">[${message.author[0].date}]:</p>
            <p class="message"> ${message.text}</p>
            <img style="max-height : 40px"class="img-fluid" src="${message.author[0].avatar}" alt="${message.author[0]._id}'s avatar">
            </div>
        </div>`)
    }).join("");
    document.getElementById('message-container').innerHTML = html;
    let compression = (100 * JSON.stringify(messages).length) /JSON.stringify(normalizedMessages).length
    document.getElementById('compression').innerHTML = `La tasa de compresion es del ${compression}%`;
}
socket.on('error', () => {
    document.getElementById('error-container').innerHTML = '<h2 class="title">Error en el formato del producto, no deje ningun campo en blanco e ingrese un valor númerico al precio</h2>';
})
socket.on('mailError', () => {
    document.getElementById('mailError-container').innerHTML = '<h2 class="title">Error en el formato del mensaje, no deje ningun campo en blanco e ingrese un valor válido en el campo de email. Ademas compruebe que la edad sea un valor númerico</h2>';
})
socket.on('messages', data => {
    messageRender(data);
    document.getElementById('mailError-container').innerHTML = "";
    document.getElementById('message-text').value = "";
    document.getElementById('message-text').focus();
})
socket.on('products', data => {
    render(data);
    document.getElementById('error-container').innerHTML = "";

})
const addProduct = (e) => {
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("image").value
    };
    socket.emit('product', product);
    document.getElementById("title").value = '';
    document.getElementById("price").value = '';
    document.getElementById("image").value = '';
    document.getElementById("title").focus();
    return false;
}
