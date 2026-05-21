const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URI
const app = express()
const PORT = process.env.PORT
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
    await client.connect();
    const db = client.db('ideavault')
    const ideascollection = db.collection('ideas')
    const myideascollection = db.collection('my-ideas')

    app.post('/my-ideas', async (req, res) => {
      const ideaData = req.body
      const result = await myideascollection.insertOne(ideaData)
      res.json(result)
    })

    app.get('/my-ideas', async (req, res) => {
    const result = await myideascollection.find().toArray()
    res.json(result)
})

    app.get('/ideas', async (req, res) => {
      const result = await ideascollection.find().toArray()
      res.json(result)
    })

    app.get('/ideas/:id', async (req, res) => {
      const { id } = req.params
      const result = await ideascollection.findOne({ _id: new ObjectId(id) })
      res.json(result)
    })

    app.patch('/ideas/:id', async (req, res) => {
      const { id } = req.params
      const updatedData = req.body
      const result = await ideascollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      )
      res.json(result)
    })

    app.delete('/ideas/:id', async (req, res) => {
      const { id } = req.params
      const result = await ideascollection.deleteOne({ _id: new ObjectId(id) })
      res.json(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Server is running fine")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})