import { App, Configuration, Context } from "../main";

export async function runBeforeEach<CTX extends Context<CONFIG>, CONFIG extends Configuration>(): Promise<App<CTX, CONFIG>> {
  const app = new App<CTX, CONFIG>();

  await app.initialize({ configPath: "./config.test.json" });

  const allCollections = await app.context.database.db().collections();
  await Promise.all(allCollections.map(collection => collection.deleteMany()));

  return app;
}

export async function runAfterEach<CTX extends Context<CONFIG>, CONFIG extends Configuration>(app: App<CTX, CONFIG>) {
  await app.finalize();
}
