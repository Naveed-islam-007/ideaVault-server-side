const express= require('express')
const cors=require('cors')
const dotenv=require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URI
const app=express()
const PORT=process.env.PORT
app.use(cors())
app.use(express.json())

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
   const db=client.db('ideavault')
   const ideascollection=db.collection('ideas')

   app.post('/ideas', async(req,res)=>{
    const ideaData=req.body
    const result=await ideascollection.insertOne(ideaData)
    res.json(result)
   })

  app.get('/ideas',async(req,res)=>{
    const result= await ideascollection.find().toArray()
    res.json(result)
  })

  app.get('/ideas/:id',async(req,res)=>{
    const {id}=req.params
    const result= await ideascollection.findOne({_id:new ObjectId(id)})
    res.json(result)
  })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  //  await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("Server is running fine")
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})