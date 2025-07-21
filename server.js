// const express= require('express')
// const colors= require('colors')

import express from "express";
import colors from "colors";
import dotenv from 'dotenv'
import morgan from "morgan";
import connectdb from "./config/db.js";
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors'

// config env
dotenv.config()

// database
connectdb();

// rest object 
const app= express()

// middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)

//rest api
app.get('/',(req,res)=>{
    res.send("<h1>Welcome to ECOMMERCE WEB APP!!</h1>")
   
})

// port
// const PORT= 8080
const PORT= process.env.PORT || 8080;

//run listen

app.listen(PORT,()=>{
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgBlue.white);
}) 
