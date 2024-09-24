import express from "express";
import { Express } from "express";

import { Context } from "./context";
import { Configuration, readConfiguration } from "./configuration";
import { setupDatabase } from "./database";
import { setupObjstorage } from "./objstorage";
import { WrappedHandler, RawHandler, wrapHandler } from "./handler";

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
import { userLogin } from "../endpoints/user/login";
import { userAuthorize } from "../endpoints/user/authorize";
import { userLogout } from "../endpoints/user/logout";

import { fileCreate } from "../endpoints/file/create";
import { fileGet } from "../endpoints/file/get";
import { fileUpdate } from "../endpoints/file/update";
import { fileDelete } from "../endpoints/file/delete";
import { fileList } from "../endpoints/file/list-all";
import { fileUpload } from "../endpoints/file/upload";
import { fileDownload } from "../endpoints/file/download";

export interface AppInitializeParams<CTX extends Context<CONFIG>, CONFIG extends Configuration> {
  configPath: string;
  setupConfiguration?: (baseConfiguration: Configuration) => CONFIG;
  setupContext?: (baseAppContext: Context<CONFIG>) => CTX;
}

export class App<CTX extends Context<CONFIG>, CONFIG extends Configuration> {
  public context: CTX;
  public express: Express;

  public constructor() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.context = null as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.express = null as any;
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
    this.register(userLogin);
    this.register(userAuthorize);
    this.register(userLogout);

    this.register(fileCreate);
    this.register(fileGet);
    this.register(fileUpdate);
    this.register(fileDelete);
    this.register(fileList);
    this.registerRaw(fileUpload(this.context));
    this.registerRaw(fileDownload(this.context));
  }

  public register<PARAMS, DATA, RESPONSE>(wrappedHandler: WrappedHandler<CTX, CONFIG, PARAMS, DATA, RESPONSE>) {
    this.express.post(
      `/${wrappedHandler.namespace}/${wrappedHandler.entity}/${wrappedHandler.operation}`,
      express.json(),
      wrapHandler<CTX, CONFIG, PARAMS, DATA, RESPONSE>(this.context, wrappedHandler),
    );
  }

  public registerRaw(rawHandler: RawHandler) {
    this.express[rawHandler.method](
      rawHandler.path,
      rawHandler.handle,
    );
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
