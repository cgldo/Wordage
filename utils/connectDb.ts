import { Prompt } from "../utils/types";

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://bi:hTv3wE3T6fifztLx@biadd.wvxnwxq.mongodb.net/?retryWrites=true&w=majority";
/**
 * 
 * @param prompt 
 * @returns 
 */
export async function query(prompt: Prompt) {
    const client = new MongoClient(uri);
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        const database = await client.db("biadd");
        // Make the appropriate DB calls
        prompt.noun = await database.Noun.aggregate([{ $sample: { size: 1 } }]);
        prompt.adjective = await database.Adjective.aggregate([{ $sample: { size: 1 } }]);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
        return prompt;
    }
}