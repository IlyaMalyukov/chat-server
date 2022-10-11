const express = require('express')
const mongoose = require('mongoose')
const { dbUrl } = require('./config')
const authRouter = require('./authRouter')
const PORT = 5000
const app = express()

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json())
app.use('/', authRouter)

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

const start = async () => {
  try {
    await mongoose.connect(dbUrl)
    http.listen(PORT, () => {
      console.log('Server is started')
    })
  } catch(e) {
    console.log(e)
  }
}

start()