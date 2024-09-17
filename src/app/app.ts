import * as express from "express";
import { Express } from "express";
import { Context } from "./context";
import { Configuration, readConfiguration } from "./configuration";
import { setupDatabase } from "./database";
import { setupObjstorage } from "./objstorage";
import { Handler, wrapHandler } from "./handler";

import { healthCheckRun } from "../endpoints/health-check/run";
import { pageCreate } from "../endpoints/page/create";
import { pageGet } from "../endpoints/page/get";
import { pageList } from "../endpoints/page/list-all";
import { pageUpdate } from "../endpoints/page/update";
import { pageDelete } from "../endpoints/page/delete";
import { userCreate } from "../endpoints/user/create";
import { userGet } from "../endpoints/user/get";
import { userDelete } from "../endpoints/user/delete";
import { userUpdate } from "../endpoints/user/update";
import { userList } from "../endpoints/user/list-all";
import { fileCreate } from "../endpoints/file/create";
import { fileGet } from "../endpoints/file/get";
import { fileUpdate } from "../endpoints/file/update";
import { fileDelete } from "../endpoints/file/delete";
import { fileList } from "../endpoints/file/list";

export interface AppInitializeParams<CTX extends Context<CONFIG>, CONFIG extends Configuration> {
  configPath: string;
  setupConfiguration?: (baseConfiguration: Configuration) => CONFIG;
  setupContext?: (baseAppContext: Context<CONFIG>) => CTX;
}

export class App<CTX extends Context<CONFIG>, CONFIG extends Configuration> {
  public context: CTX | null;
  public express: Express | null;

  public constructor() {
    this.context = null;
    this.express = null;
  }

  public async initialize(params: AppInitializeParams<CTX, CONFIG>) {
    params.setupConfiguration = params.setupConfiguration ?? ((config) => config as CONFIG);
    params.setupContext = params.setupContext ?? ((context) => context as CTX);

    const configuration = params.setupConfiguration(readConfiguration(params.configPath));
    const database = await setupDatabase(configuration);
    const objstorage = setupObjstorage(configuration);

    this.context = params.setupContext({
      configuration,
      database,
      objstorage,
    });

    this.express = express();

    this.register(healthCheckRun);

    this.register(pageCreate);
    this.register(pageGet);
    this.register(pageList);
    this.register(pageUpdate);
    this.register(pageDelete);

    this.register(userCreate);
    this.register(userGet);
    this.register(userDelete);
    this.register(userUpdate);
    this.register(userList);

    this.register(fileCreate);
    this.register(fileGet);
    this.register(fileUpdate);
    this.register(fileDelete);
    this.register(fileList);
  }

  public register<PARAMS, DATA, RESPONSE>(handler: Handler<CTX, CONFIG, PARAMS, DATA, RESPONSE>) {
    const path = `/${handler.namespace}/${handler.entity}/${handler.operation}`;

    this.express.post(path, express.json(), wrapHandler<CTX, CONFIG, PARAMS, DATA, RESPONSE>(this.context, handler));

    return this;
  }

  public run() {
    this.express.listen(this.context.configuration.port, () => {
      console.log(`Server started at ${this.context.configuration.domain}:${this.context.configuration.port}`);
    });
  }

  public async finalize() {
    await this.context.database.close();
  }
}
