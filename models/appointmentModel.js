const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema(
	{
		date: { type: String, required: true },
		email: { type: String, required: true },
	},
)


const Person = mongoose.model("Appointment", AppointmentSchema);
module.exports = Person;