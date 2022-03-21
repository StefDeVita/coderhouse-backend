

const calculateNumbers = (cant) =>{
    const numbers = {};
    for (let i = 0; i < cant; i++) {
        let number = Math.floor(Math.random() * cant);
        if(!numbers[number]){
            numbers[number] = 1;
        }
        else{
            numbers[number]++;
        }
    }
    return numbers;
}
process.on('message',cant =>{
    let calc = calculateNumbers(cant.cant);
    process.send({calc:calc})
})