import { MongoClient } from "mongodb";
import { Client as MinioClient } from "minio";
import { Configuration } from "./configuration";

export interface Context<CONFIG extends Configuration> {
  configuration: CONFIG;
  database: MongoClient;
  objstorage: MinioClient;
}
