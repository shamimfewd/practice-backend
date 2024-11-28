const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://backend_practice:n5g2uUxws3JXzqKl@cluster0.ssblxww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const dataCollection = client
      .db("backendPracticeDB")
      .collection("backendData");

    app.post("/postData", async (req, res) => {
      const item = req.body;
      const result = await dataCollection.insertOne(item);
      res.send(result);
    });

    app.get("/getAllData", async (req, res) => {
      const result = await dataCollection.find().toArray();
      res.send(result);
    });

    app.delete("/deleteData/:id", async (req, res) => {
      const id = req.params.id;
      const quire = { _id: new ObjectId(id) };
      const result = await dataCollection.deleteOne(quire);
      res.send(result);
    });

    app.get("/getUpdateData/:id", async (req, res) => {
      const id = req.params.id;
      const quire = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(quire);
      res.send(result);
    });

    app.put("/upData/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const optional = { upsert: true };
      const data = {
        $set: {
          name: req.body.name,
          price: req.body.price,
        },
      };

      const result = await dataCollection.updateOne(filter, data, optional);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`test app listening on port ${port}`);
});
