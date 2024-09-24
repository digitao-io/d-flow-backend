import fs from "node:fs";

export interface Configuration {
  domain: string;
  port: number;
  database: ConfigurationDatabase;
  objstorage: ConfigurationObjstorage;
  users: ConfigurationCredential[];
  jwt: ConfigurationJwt;
}

export interface ConfigurationDatabase {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface ConfigurationObjstorage {
  host: string;
  port: number;
  user: string;
  password: string;
  bucket: string;
}

export interface ConfigurationCredential {
  username: string;
  passwordHash: string;
}

export interface ConfigurationJwt {
  serverSecret: string;
  expireIn: number;
}

export function readConfiguration<CONFIG extends Configuration>(configPath: string): CONFIG {
  if (!configPath) {
    throw Error("Invalid configuration path");
  }

  if (!fs.existsSync(configPath)) {
    throw Error(`Configuration path doesn't exist: ${configPath}`);
  }

  if (!fs.statSync(configPath).isFile()) {
    throw Error(`Configuration path isn't a file: ${configPath}`);
  }

  const configFileContent = fs.readFileSync(configPath, "utf-8");

  let config: CONFIG;
  try {
    config = JSON.parse(configFileContent);
  }
  catch {
    throw Error(`Cannot parse configuration: ${configPath}`);
  }

  return config;
}
