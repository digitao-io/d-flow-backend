import supertest from "supertest";
import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";

describe("/site/user/authorize", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should return 401 if user hasn't logged in", async () => {
    const response = await supertest(app.express)
      .post("/site/user/authorize");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "AUTH_FAILED",
      message: "Authorization failed",
    });
  });

  it("should return 200 if user has logged in", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/user/authorize")
      .set("Cookie", [jwtCookie]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
    });
  });
});
