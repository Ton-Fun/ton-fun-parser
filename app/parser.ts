// TEST
import {MongoClient} from "mongodb";

const uri = 'mongodb://root:example@localhost:27017'
const client: MongoClient = new MongoClient(uri)

export async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Establish and verify connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}