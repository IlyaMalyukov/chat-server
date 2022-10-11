const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secretKey } = require('./config')

const generateAccessToken = (id, roles) => {
  const payload = {id, roles}

  return jwt.sign(payload, secretKey, {expiresIn: '24h'})
}

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Registration error', errors})
      }

      const {name, password} = req.body
      const candidate = await User.findOne({name})

      if (candidate) {
      return res.status(400).json({message: 'User already exists'})
      }

      const hashPassword = bcrypt.hashSync(password, 7)
      const userRole = await Role.findOne({value: 'USER'})

      const user = new User({
        name, 
        password: hashPassword,
        roles: [userRole.value] 
      })

      await user.save()

      return res.json({message: 'User successfully registered'})

    } catch(e) {
      console.log(e)
      res.status(400).json({message: 'Registration Error'})
    }
  }

  async login(req, res) {
    try {
       const { name, password } = req.body
       const user = await User.findOne({name})

       if (!user) {
        return res.status(400).json({message: 'User is not found'})
       }

       const validPassword = bcrypt.compareSync(password, user.password)

       if (!validPassword) {
        return res.status(400).json({message: 'Wrong password'})
       }

       const token = generateAccessToken(user._id, user.roles)

       return res.json({token})

    } catch(e) {
      console.log(e)
      res.status(400).json({message: 'Login Error'})
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find()
      res.json(users)
    } catch(e) {
      console.log(e)
      res.status(400).json({message: 'Error'})
    }
  }
}

module.exports = new authController()