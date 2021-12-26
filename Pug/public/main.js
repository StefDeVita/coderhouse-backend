function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
const validarEntrada = () => {
    let precio = document.getElementById("price").value;
    console.log(precio)
    if(!isNumeric(precio)){
        document.getElementById("btn").disabled = true;
    }
    else{
        document.getElementById("btn").disabled = false;
    }
}