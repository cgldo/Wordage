import { Prompt } from "../utils/types";

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://bi:hTv3wE3T6fifztLx@biadd.wvxnwxq.mongodb.net/?retryWrites=true&w=majority";

/**
 * 
 * @returns 
 */
export default async function getPrompt() {
    return await query();
    //console.log(prompt);
  }

  /**
   * 
   * @param prompt 
   * @returns 
   */
  export async function query() {
      const prompts: Prompt[] = []
      const client = new MongoClient(uri);
      const nouns = []
      const adjectives = []
      try {
          // Connect to the MongoDB cluster
          await client.connect();
          const database = await client.db("Wordage");
          const noun = database.collection("Noun");
          const adjective = database.collection("Adjective");
          // Make the appropriate DB calls
           await noun.aggregate([ { $sample: { size: 100 } } ]).forEach(doc => {
            nouns.push(doc.word)
           });
           await adjective.aggregate([ { $sample: { size: 100 } } ]).forEach(doc => {
            adjectives.push(doc.word)
        });

  
      } catch (e) {
          console.error(e);
      } finally {
          await client.close();
          nouns.forEach((noun, index) => {
            const adj = adjectives[index];
            prompts.push({noun:noun, adjective:adj});
          });
          //console.log(prompts)
          return prompts;
      }
  }