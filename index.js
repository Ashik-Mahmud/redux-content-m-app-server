require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb://localhost:27017/products-redux-db`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("products-redux-db");
    const productCollection = db.collection("products");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.put("/product/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { _id, ...product } = req.body;

        const getProduct = await productCollection.findOne({
          id: ObjectId(id),
        });
        const query = { _id: ObjectId(id) };
        const updatedData = { $set: product };

        /* update product */
        const result = await productCollection.updateOne(query, updatedData);

        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
