const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { dbUrl } = require('./config')
const authRouter = require('./authRouter')
const PORT = 5000
const app = express()

const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors())
app.use(express.json())
app.use('/', authRouter)

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://localhost:3000");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

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