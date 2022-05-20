const {MessagesDao} = require('./containerCreator')
class MessagesDto{
    constructor(){
        this.messages = MessagesDao;
    }
    getAll(){
        return this.messages.getAll();
    }
    push(message){
        this.messages.save(message);
    }
    update(id,message){
        return this.messages.update(id,message);
    }
    delete(id){
        let message = this.messages.getById(id)
        this.messages.deleteById(id);
        return message;
    }
    get(id){
        return this.messages.getById(id)
    }
}

const messagesDto = new MessagesDto()
module.exports = messagesDto