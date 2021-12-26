const fs = require('fs');


const read = async (path) =>{
    try{
        const content = await fs.promises.readFile(path,"utf-8");
        return content
    }
    catch(err){
        throw new Error(err,"Error de lectura");
    }
}
const write = async (path,value) =>{
    try{
        const content = await fs.promises.writeFile(path,value);
        return content
    }
    catch(err){
        console.log("Error de escritura",err)
    }
}

class Container{
    constructor(path){
        this.path = path;
        this.id = 0;
        this.content = [];
        try{
            read(this.path).then(res =>{
                this.content = JSON.parse(res)
            })
            this.content.forEach(element => {
                if(element.id >= this.id){
                    this.id = element.id + 1;
                }
            });
        }catch(err){
            console.log(err)
            (async() => await write(this.path,"[]"))();
        }
    }
    
    save(object){
        object.id = this.id;
        this.content.push(object)
        this.id++;
        write(this.path,JSON.stringify(this.content)).catch(err=>{
            console.log("Error al escribir",err)
        })
        return this.id - 1;
    }
    getAll(){
        return this.content;
    }
    deleteById(id){
        this.content = this.content.filter(e => e.id !== Number(id));
        write(this.path,JSON.stringify(this.content)).catch(err =>{
            console.log("Error al escribir",err);
        })
    }
    deleteAll(){
        this.content = [];
        try{
            async()=> await write(this.path,"[]");
        }
        catch(err){
            console.log(err)
        }
    }
    update(id,product){
        let oldProduct = this.getById(id);
        if(!oldProduct){
            return null;
        }
        let newProduct = {...product,id:oldProduct.id};
        this.deleteById(id);
        this.content.push(newProduct);
        write(this.path,JSON.stringify(this.content)).catch(err =>{
            console.log("Error al escribir",err);
        })
        return newProduct;
    }
    getById(id){
        let value =  this.content.find(e => e.id === Number(id))
        if(!value){
            return null;
        }
        return value
    }
}
module.exports = {Container}