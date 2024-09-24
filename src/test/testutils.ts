import supertest from "supertest";
import { App, Configuration, Context } from "../main";

export async function runBeforeEach<CTX extends Context<CONFIG>, CONFIG extends Configuration>(): Promise<App<CTX, CONFIG>> {
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.clearAllMocks();

  const app = new App<CTX, CONFIG>();

  await app.initialize({ configPath: "./config.test.json" });

  const allCollections = await app.context.database.db().collections();
  await Promise.all(allCollections.map((collection) => collection.deleteMany()));

  const allObjects = await app.context.objstorage.listObjects(app.context.configuration.objstorage.bucket).toArray();
  await Promise.all(allObjects.map((object) => app.context.objstorage.removeObject(
    app.context.configuration.objstorage.bucket,
    object.name,
  )));

  return app;
}

export async function runAfterEach<CTX extends Context<CONFIG>, CONFIG extends Configuration>(app: App<CTX, CONFIG>) {
  await app.finalize();
}

export async function getAuthCookie<CTX extends Context<CONFIG>, CONFIG extends Configuration>(app: App<CTX, CONFIG>): Promise<string> {
  const response = await supertest(app.express)
    .post("/site/user/login")
    .send({
      data: {
        username: "testuser",
        password: "no-password",
      },
    });

  const jwtCookie = response.headers["set-cookie"][0];
  const jwt = jwtCookie.split(";")[0];

  return jwt;
}
