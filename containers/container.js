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
        this._id = 0;
        this.content = [];
        try{
            read(this.path).then(res =>{
                this.content = JSON.parse(res)
                this.content.forEach(element => {
                    if(element._id >= this._id){
                        this._id = element._id + 1;
                    }
                });
            })
            
        }catch(err){
            console.log(err)
            (async() => await write(this.path,"[]"))();
        }
    }
    
    save(object){
        object._id = this._id;
        object.timestamp = Date.now();
        this.content.push(object)
        this._id++;
        write(this.path,JSON.stringify(this.content)).catch(err=>{
            console.log("Error al escribir",err)
        })
        return object;
    }
    getAll(){
        return this.content;
    }
    deleteByid(_id){
        this.content = this.content.filter(e => e._id !== Number(_id));
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
    update(_id,product){
        let changingProduct = this.getBy_id(_id);
        if(!changingProduct){
            return null;
        }
        let newProduct = {...product,_id:changingProduct._id};
        this.deleteBy_id(_id);
        this.content.push(newProduct);
        write(this.path,JSON.stringify(this.content)).catch(err =>{
            console.log("Error al escribir",err);
        })
        return newProduct;
    }
    getByid(_id){
        let value =  this.content.find(e => e._id === Number(_id))
        if(!value){
            return null;
        }
        return value
    }
}
module.exports = {Container}


