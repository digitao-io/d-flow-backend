import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/user/get", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404, if the user doesn't exist", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/user/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { username: "admin" },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "User with name admin doesn't exist",
    });
  });

  it("should return user entity without password field", async () => {
    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
      .post("/site/user/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          username: "admin",
          password: "password",
          displayName: "Administrator",
          email: "admin@example.com",
        },
      });

    const response = await supertest(app.express)
      .post("/site/user/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { username: "admin" },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        username: "admin",
        displayName: "Administrator",
        email: "admin@example.com",
      },
    });
  });
});
