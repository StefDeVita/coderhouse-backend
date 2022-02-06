const admin = require("firebase-admin");

const serviceAccount = require("../db/backend-coderhouse-69e47-firebase-adminsdk-kwnd1-8d1d7f590e.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

class FireContainer{
    constructor(query){
        
        this.db = admin.firestore();
        this.query = this.db.collection(query)
        console.log("Firebase db connected")
    }
    
    async save(object){
        try{
            const doc = this.query.doc()
            await doc.create({timestamp:Date.now(),id:doc.id,...object})
            return this.getById(doc.id)
        }catch(err){
            console.log(err)
        }
    }
    async getAll(){
        try{
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;
            let response = [];
            docs.forEach(doc => response.push(doc.data()));
            return response;

        }catch(err){
            console.log(err)
        }
    }
    async deleteByid(_id){
        try{
            const doc = query.doc(`${id}`);
            const item = await doc.delete();
            return item;
        }catch(err){console.log(err)}
    }
    async deleteAll(){
        try{
            db.collection(query).get().then(querySnapshot => {
                querySnapshot.docs.forEach(snapshot => {
                    snapshot.ref.delete();
                })
            })
        }
        catch(err){
            console.log(err)
        }
    }
    async update(_id,product){
        try{
            const doc = this.query.doc(`${_id}`);
            let item = await doc.update(product);
            return item;
        }catch(err){console.log(err)}
    }
    async getById(_id){
        try{
            const doc = this.query.doc(`${_id}`);
            let item = await doc.get();
            return item.data();
        }catch(err){console.log(err)}
    }
}
module.exports = {FireContainer}