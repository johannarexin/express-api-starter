import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import ceramics from './data/ceramics.data.json'

console.log(ceramics)

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/final-project"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Ceramics = mongoose.model('Ceramics', {
  header: String,
  text: String,
  // image: "" // VAD SKA EN BILD HA?
})

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Ceramics.deleteMany({})

    ceramics.forEach((item) => {
      const newCeramic = new Ceramics(item)
      newCeramic.save()
    })
  }
  seedDatabase()
}

// new Ceramics({ header: 'Hej', text: 'En fin kruka'}).save()


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('This is an API with my ceramics. Best, Johanna Rexin')
})

// Endpoint 1, all the ceramics
app.get('/ceramics', async (req, res) => {
  const ceramics = await Ceramics.find()
  res.json(ceramics)
})

// Endpoint 2, showing only one ceramics identified by id
app.get('/ceramics/id/:id', async (req, res) => {
  const { id } = req.params
  const ceramicsId = await Ceramics.findOne({id: id})
  res.json(ceramicsId)
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
