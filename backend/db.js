const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://rachit24:rachit242531@cluster0.2iju6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected to Mongo!");
    })
}
  
module.exports = connectToMongo;