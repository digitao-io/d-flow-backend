import { Client as MinioClient } from "minio";
import { Configuration } from "./configuration";

export function setupObjstorage(configuration: Configuration): MinioClient {
  const objConfig = configuration.objstorage;

  const objstorage = new MinioClient({
    endPoint: objConfig.host,
    port: objConfig.port,
    useSSL: false,
    accessKey: objConfig.user,
    secretKey: objConfig.password,
  });

  return objstorage;
}
