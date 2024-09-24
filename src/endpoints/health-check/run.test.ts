import { App, Configuration, Context } from "../../main";
import { runBeforeEach, runAfterEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/health-check/run", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response correctly", async () => {
    const response = await supertest(app.express)
      .post("/site/health-check/run");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
    });
  });
});
