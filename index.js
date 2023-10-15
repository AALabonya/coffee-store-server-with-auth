const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

//middleware 

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgxmyrt.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database =client.db("coffeeDB");
    const coffeeCollection = database.collection("coffeeCollection")
    const userCollection = database.collection("userInformation")
    //read
   app.get("/coffee", async(req,res)=>{
      const cursor = coffeeCollection.find()
      const result= await cursor.toArray()
      res.send(result)
   })

   app.get("/coffee/:id",async(req, res)=>{
    const id= req.params.id;
    const query= {_id: new ObjectId(id)}
    const coffee = await coffeeCollection.findOne(query)
    res.send(coffee)
   })

   app.post("/coffee", async(req, res)=>{
    const newCoffee = req.body
    console.log(newCoffee);
    const result =await coffeeCollection.insertOne(newCoffee)
    res.send(result)
   })

   app.put("/coffee/:id",async(req, res)=>{
    const id = req.params.id
    const coffee = req.body
    console.log(id, coffee);
    const filter = {_id :new ObjectId(id)}
    const option = {upsert: true}
    const updatedCoffee ={
      $set:{
        name:coffee.name,
        quantity:coffee.quantity,
        supplier:coffee.supplier,
        taste:coffee.taste,
        category:coffee.category,
        details:coffee.details,
        Photo:coffee.Photo


      }
    }
    const result = await coffeeCollection.updateOne(filter,updatedCoffee,option)
    res.send(result)
   })
   
   app.delete("/coffee/:id", async(req, res)=>{
    const id = req.params.id;
    console.log("please delete from database", id)
    const query ={_id: new ObjectId(id)}
    const result = await coffeeCollection.deleteOne(query)
    res.send(result)
   })

   // user related information api 
app.get("/user", async(req, res)=>{
  const cursor = userCollection.find()
  const result =await cursor.toArray()
  res.send(result)
})

   app.post("/user", async(req, res)=>{
    const user = req.body
    console.log(user);
    const result = await userCollection.insertOne(user)
    res.send(result)
   })

   app.patch("/user", async(req, res)=>{
    const user =req.body 
    const filter = {email: user.email}
    const updatedDoc ={
      $set:{
        lastLoggedAt: user.lastLoggedAt
      }
    }
    const result = await userCollection.updateOne(filter, updatedDoc)
    res.send(result)
   })
 app.delete("/user/:id", async(req, res)=>{
  const id =req.params.id
  const query = {_id :new ObjectId(id)}
  const result = await userCollection.deleteOne(query)
  res.send(result)
 })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get("/", (req, res)=>{
    res.send("COFFEE STORE SERVER COMING SOON")
})


app.listen(port, ()=>{
    console.log(`HERE IS IS PORT, ${port}`)
})