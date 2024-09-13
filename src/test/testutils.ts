import { App } from "../main";

export async function runBeforeEach() {
  const app = new App();

  await app.initialize({ configPath: "./config.test.json" });

  const allCollections = await app.context.database.db().collections();
  await Promise.all(allCollections.map(collection => collection.deleteMany()));

  return app;
}
