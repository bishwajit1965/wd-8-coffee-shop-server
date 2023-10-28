const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Mongo db connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.l3p6wcn.mongodb.net/?retryWrites=true&w=majority`;
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
    // await client.connect();
    // ================= CODE BELOW===================
    const coffeeCollection = client.db("coffee-house").collection("coffees");
    const galleryCollection = client.db("coffee-house").collection("gallery");
    const userCollection = client.db("coffee-house").collection("users");

    /**===============================================
     *  COFFEE RELATED APIS
     * ============================================**/
    app.get("/coffees", async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Add coffee
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // Fetch a single coffee
    app.get("/single-coffee/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(cursor);
      res.send(result);
    });
    // Delete a coffee
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(cursor);
      res.send(result);
    });

    // Get coffee to update
    app.get("/update-coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // Update a coffee
    app.put("/update-coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          details: updatedCoffee.details,
          category: updatedCoffee.category,
          photoUrl: updatedCoffee.photoUrl,
          price: updatedCoffee.price,
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    /**===============================================
     *  GALLERY RELATED APIS
     * ============================================**/

    // Fetch gallery images
    app.get("/gallery", async (req, res) => {
      const cursor = galleryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Post gallery images
    app.post("/gallery", async (req, res) => {
      const newGallery = req.body;
      const result = await galleryCollection.insertOne(newGallery);
      res.send(result);
    });

    // Single gallery
    app.get("/single-gallery/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await galleryCollection.findOne(query);
      res.send(result);
    });

    // Get gallery to update
    app.get("/update-gallery/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await galleryCollection.findOne(query);
      res.send(result);
    });

    // Update a gallery data
    app.put("/update-gallery/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedGallery = req.body;
      const coffee = {
        $set: {
          name: updatedGallery.name,
          chef: updatedGallery.chef,
          supplier: updatedGallery.supplier,
          taste: updatedGallery.taste,
          details: updatedGallery.details,
          category: updatedGallery.category,
          photoUrl: updatedGallery.photoUrl,
          price: updatedGallery.price,
        },
      };
      const result = await galleryCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // Delete a coffee
    app.delete("/gallery/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await galleryCollection.deleteOne(cursor);
      res.send(result);
    });

    /**===============================================
     *  USERS RELATED APIS
     * ============================================**/
    // Create users
    app.post("/users", async (req, res) => {
      const query = req.body;
      const result = await userCollection.insertOne(query);
      res.send(result);
    });

    // Fetch users data
    app.get("/users", async (req, res) => {
      try {
        const query = await userCollection.find().toArray();
        res.send(query);
      } catch (error) {
        console.log(error);
      }
    });

    // Delete users
    app.delete("/users/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const cursor = { _id: new ObjectId(id) };
        const result = await userCollection.deleteOne(cursor);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    // Update
    app.patch("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          lastLoggedAt: user.lastLoggedAt,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.listen(port, () => {
      console.log(`Coffee shop server is listening on port: ${port}`);
    });

    // ================= CODE ABOVE===================

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
