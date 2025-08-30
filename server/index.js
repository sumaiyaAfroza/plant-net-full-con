import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'


// require('dotenv').config()
// const express = require('express')                 **** import koreo kora jay bt aita standard****
// const cors = require('cors')
// const cookieParser = require('cookie-parser')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
// const jwt = require('jsonwebtoken')


dotenv.config()
const stripe = Stripe(process.env.SK_key)
const port = process.env.PORT || 3000
const app = express()
// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token

  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: 'unauthorized access' })
    }
    req.user = decoded
    next()
  })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@urmi-project.bsifax9.mongodb.net/?retryWrites=true&w=majority&appName=urmi-project`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ema-john.ftku5dr.mongodb.net/?retryWrites=true&w=majority&appName=ema-john`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  const plantsCollection =client.db('plantDB').collection('plants')
  const orderCollection =client.db('plantDB').collection('orders')
  const usersCollection =client.db('plantDB').collection('users')


  try {

    // Generate jwt token
    app.post('/jwt', async (req, res) => {
      const email = req.body
      const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '365d',
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: true })
    })
    // Logout
    app.get('/logout', async (req, res) => {
      try {
        res
          .clearCookie('token', {
            maxAge: 0,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
          })
          .send({ success: true })
      } catch (err) {
        res.status(500).send(err)
      }
    })

    app.post('/add-plant',async(req,res)=>{
      const id = req.body
      // console.log(id)
      const result = await plantsCollection.insertOne(id)
      res.send(result)

    })

    app.get('/plants',async(req,res)=>{
      const result = await plantsCollection.find().toArray()
      res.send(result)
    })

    app.get('/plant/:id', async (req, res) => {
      const id = req.params.id
      const result = await plantsCollection.findOne({
        _id: new ObjectId(id),
      })
      res.send(result)
    })

    app.post('/create-payment-intent', async(req,res)=>{
      const {plantId, quantity} = req.body;
       console.log(plantId, quantity);

      const plant = await plantsCollection.findOne({
        _id: new ObjectId(plantId)
      })
      // console.log(plant);

      if(!plant) return res.status(404).send({message: 'plant not found'})
      const  totalPrice = quantity * plant?.price * 100    /** aikhane 1 cent e 100 hoi, payment cent korte hoi tai 100 gun dise */
        
      const {client_secret} =await stripe.paymentIntents.create({
        amount: totalPrice,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true
        }
      })
      // console.log();
      res.send({clientSecret: client_secret})
    })

//  quantity
    app.patch('/quantity-update/:id',async(req,res)=>{
      const id = req.params.id
      const {quantityToUpdate, status} = req.body 
      // console.log(quantityToUpdate, status);
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
        $inc:{
          quantity: status === 'increase' ? quantityToUpdate: -quantityToUpdate
        }
      }
      const result = await plantsCollection.updateOne(filter, updateDoc)
      res.send(result)
    })


app.post('/orders',async(req,res)=>{
  const data = req.body
  const result = await orderCollection.insertOne(data)
  res.send(result) 
})


// user er data 
app.post('/users',async(req,res)=>{
  const userInfo = req.body
  userInfo.role = 'customer',
  userInfo.create_At = new Date().toISOString()
  userInfo.last_login = new Date().toISOString()
  const query = {
    email: userInfo?.email
  }

  const alreadyExists = await usersCollection.findOne(query)
  // console.log(alreadyExists);
  // console.log(!!alreadyExists);

  // jodi email take taile last_login update hobe .
  if(!!alreadyExists){
    const result = await usersCollection.updateOne(query,{
       $set:{ last_login : new Date().toISOString()}
    })
    return res.send(result)
  }

  const result = await usersCollection.insertOne(userInfo)
  res.send(result)
})

app.get('/all-user', async (req,res)=>{
    const result = await usersCollection.find().toArray()
    res.send(result)
})
      



//  role onujai user neoa email diye
app.get('/users/role/:email',async(req,res)=>{
  const email = req.params.email
  const result = await usersCollection.findOne({email})
   
  if(!result) return res.status(404).send({message: 'user not found'})
    res.send({role: result?.role})
})


    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello from plantNet Server..')
})

app.listen(port, () => {
  console.log(`plantNet is running on port ${port}`)
})

