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
    credentials: true,
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin:'*',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}))
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