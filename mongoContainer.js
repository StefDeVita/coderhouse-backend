const mongoose = require('mongoose')




class MongoContainer{
    constructor(uri,model){
        mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        let db = mongoose.connection
        db.once("open", () => console.log("MongoDB Atlas connected"));
        db.on("error", console.error.bind(console, "MongoDB connection error:"));  
        this.model = model;
    }
    
    async save(object){
        object.timestamp = Date.now();
        const newItem = new this.model({...object})
        await newItem.save()
        return newItem
    }
    async getAll(){
        return await this.model.find({})
    }
    async deleteById(id){
        let deleted = await this.model.findByIdAndDelete(id);
        return deleted
    }
    async deleteAll(){
        this.model.deleteMany({})
    }
    async update(id,product){
        let changingProduct = await this.model.findById(id);
        if(!changingProduct){
            return null;
        }
        const newProduct = await this.model.findByIdAndUpdate(id,product,{new:true}).exec();
        return newProduct;
    }
    async getById(id){
        let result = await this.model.findById(id).exec()
        if(!result){
            return null;
        }
        return result.toObject()
    }
}
module.exports = {MongoContainer}