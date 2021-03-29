const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const bodyParser = require('body-parser');
// const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cvjjn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.DB_NAME);


// const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.29dw1.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;


const app = express()

// app.use(bodyParser.json())

app.use(express.json());

app.use(cors());



const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("mahfuzAntor").collection("first");
  const ordersCollection = client.db("mahfuzAntor").collection("orders");

  app.post('/addProduct', (req, res) => {
    const products = req.body;
    // console.log(product);
    productsCollection.insertOne(products)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })

  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })

  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    // console.log(product);
    ordersCollection.insertOne(order)
    .then(result => {
      // console.log(result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
  
  // console.log('Database connected successfully.');
  // perform actions on the collection object
  // client.close();
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)