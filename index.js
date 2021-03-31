const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'skmsi';

// mongodb Database username password set
const uri = "mongodb+srv://skmsi:skmsi@cluster0.1zupo.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// middleware
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

 // File send system
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// MongoDB system Work
client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  // MongoDB Database to api make
app.get("/products", (req, res) => {
    productCollection.find({})
    .toArray( (err, document) => {
        res.send(document);
    })
});
  
// MongoDB database data update
app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, document) => {
        res.send(document[0]);
    })
});

 // MongoDB Database add data from form
app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
        .then(result => {
            console.log('data added successfully');
            res.redirect('/')
        })
    });
    // MongoDB Database update data
    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {price: req.body.price, quantity: req.body.quantity, name: req.body.name}
        })
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })
 // MongoDB Database data Delete   
app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result => {
            res.send(result.deletedCount > 0);
        })
    });


});

app.listen(3000);