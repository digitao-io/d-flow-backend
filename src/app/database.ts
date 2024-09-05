import { MongoClient } from "mongodb";
import { Configuration } from "./configuration";

export async function setupDatabase(configuration: Configuration): Promise<MongoClient> {
  const dbConfig = configuration.database;
  const uri = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?authSource=admin`;
  const client = new MongoClient(uri);

  try {
    await client.connect();
  }
  catch (err) {
    console.log(err);
    throw Error("Cannot connect to database");
  }

  return client;
}
