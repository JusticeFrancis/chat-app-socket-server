const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
        username: { type: String, required: true },
        email: { type: String, required: true , unique : true},
		user_type: { type: String ,required : true},
        password: { type: String, required: true,minlength:6 },

	},
)


const User = mongoose.model("User", UserSchema);
module.exports = User;

//note user type 2 is for student , while user type 1 is for customer service specialist