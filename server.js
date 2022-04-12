const app = require("express")();
var express = require('express')
const mongoose = require('mongoose')
var cors = require('cors')

//controllers start here
var appointment_controller = require('./controllers/AppointmentController');
var conversation_controller = require('./controllers/ConversationController');
var user_controller = require('./controllers/UserController')

//controllers stop here
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const PORT = 7000;


// app.get("/", (req, res) => {
//   res.status(200).json({ name: "Server" });
// });

const users = {};

//connecting mongodb 

const url = "mongodb+srv://justicefrancis:justicefrancis@cluster0.iegze.mongodb.net/chat_api?retryWrites=true&w=majority";


  
const connectionParams={
  useNewUrlParser: true,
}
mongoose.connect(url,connectionParams)
  .then( () => {
      console.log('Connected to the database ')
      
  })
  .catch( (err) => {
      console.error(`Error connecting to the database. n${err}`);
  })
io.on("connection", (socket) => {


  
  console.log("someone connecte and socket id " + socket.id);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);

    for (let user in users) {
      if (users[user] === socket.id) {
        delete users[user];
      }
    }

    io.emit("all_users", users);
  });

  socket.on("new_user", (username) => {
    console.log("Server : " + username);
    users[username] = socket.id;

    //we can tell every other users someone connected
    io.emit("all_users", users);
  });

  socket.on("send_message", (data) => {
    console.log(data);

    const socketId = users[data.receiver];
    io.to(socketId).emit("new_message", data);
  });

  socket.on('typing', (data)=>{
    console.log(data)
    console.log(socket.id)

    if(data.typing==true)
       io.emit('display', data)
    else
       io.emit('display', data)
  })
});

httpServer.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});

app.use(cors())
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//create appointment route 
app.post('/appointment/create', appointment_controller.createAppointment);

//verify appointment
app.post('/appointment/verify', appointment_controller.verifyAppointment);

//put conversation on hold
app.post('/hold-conversation', conversation_controller.holdConversation);

//verify conversation
app.post('/conversation/verify', conversation_controller.verifyConversationId);


//signup user 
app.post('/signup', user_controller.signup)


//signin user
app.post('/signin', user_controller.signin)
