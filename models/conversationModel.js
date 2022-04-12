const mongoose = require('mongoose')

const ConversationSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		messages: { type: Array, required: true },
	},
)


const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;