const socket = io.connect()
socket.on('products', data => {
    buyRender(data);
    if(document.getElementById('error-container')){
    document.getElementById('error-container').innerHTML = "";
    }

})
function addProduct(e) {
    socket.emit('new-product', {product:e.id,user:document.getElementById('userid').innerHTML});
    return false;
}
const buyRender = (products) => {
    if(!document.getElementById('table-buy-container')){
        return
    }
    if (products.length === 0) {
        document.getElementById('table-buy-container').innerHTML = `<h3 class="alert alert-danger">no se encontraron productos</h3>`;
        return;
    }
    document.getElementById('table-buy-container').innerHTML = `<div id="table-buy" class="table table-dark">
        <div class="tr"><span class="td">Nombre</span> <span class="td">Precio</span> <span class="td">Imagen</span> <span class="td">Añadir al carro</span> </div>`;
        let html = products.map(function (product, index) {
            return (
        `<form class="tr" id=${product.id} onsubmit="return addProduct(this)">
                <span class="td">${product.title}</span>
                <span class="td">${product.price}</span> 
                <span class="td"><img class="img-responsive" src="${product.thumbnail}" alt="${product.title}"></span>
                <span class="td"> <input value="Agregar al carrito" type=submit id="btn${product.id}" class="btn btn-success"></input></span>
            
        </form>
        `)
        }).join("");
        
        document.getElementById('table-buy').innerHTML += html;
        
}
socket.on('add-cart',data =>{
    cartRender(data.products,data.total)
})
const cartRender = (products,total) =>{
    document.getElementById('cart-container').innerHTML = `<table id="cart" class="table table-dark">
        <tr><th>Nombre</th> <th>Precio</th> <th>Subtotal</th>  <th>Imagen</th> <th>Cantidad</th> </tr>`;
    let productMap = new Map()
    products.forEach(product => {
        if(productMap.has(product.title)){
            productMap.set(product.title,productMap.get(product.title) + 1)
        }
        else{
            productMap.set(product.title , 1)
        }
    });
    let html = products.map(function (product, index) {
        return (
    `<tr>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>${product.price * productMap.get(product.title)}</td>
        <td><img class="img-responsive" src="${product.thumbnail}" alt="${product.title}"></td>
        <td>${productMap.get(product.title)}</td>
    </tr>`)
    }).join("");
    document.getElementById('cart').innerHTML += html;
    document.getElementById('total').innerHTML = "Precio Total Final : " + total

}