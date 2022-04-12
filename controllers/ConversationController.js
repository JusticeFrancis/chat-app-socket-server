const Conversation = require('../models/conversationModel')



async function holdConversation(req, res) {
    let username = req.body.username
    let messages = req.body.messages
    console.log(username)
    console.log(messages)

    try {
        const newConversation = new Conversation({username,messages})
        newConversation.save()
        let id = newConversation.id
        console.log('id'+id)
        return res.json({'id': id})
    } catch (error) {
        console.log(error)
    }


}

module.exports.holdConversation = holdConversation


async function verifyConversationId(req,res){
    console.log('hi');
    Conversation.findById(req.body.id)
    .then((doc)=>{
        console.log(doc)
       return res.json({'usermame': doc.username, 'messages' : doc.messages})
    })
    .catch((err)=>{
        console.log(err)
    })

}
module.exports.verifyConversationId = verifyConversationId