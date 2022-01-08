const socket = io.connect();
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
  
const validarEntrada = () => {
    let precio = document.getElementById("price").value;
    console.log(precio)
    if(!isNumeric(precio)){
        document.getElementById("send").disabled = true;
    }
    else{
        document.getElementById("send").disabled = false;
    }
}
const addProduct = (e) =>{
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("image").value
    };
    socket.emit('product',product);
    document.getElementById("title").value = '';
    document.getElementById("price").value = '';
    document.getElementById("image").value = '';
    document.getElementById("title").focus();
    return false;
}
