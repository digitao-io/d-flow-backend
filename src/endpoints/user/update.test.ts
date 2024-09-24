import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/user/update", () => {
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
      .post("/site/user/update")
      .set("Cookie", [jwtCookie])
      .send({
        params: { username: "admin" },
        data: {
          username: "admin",
          displayName: "Administrator",
          email: "admin@example.com",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "User with name admin doesn't exist",
    });
  });

  it("should update the existing user", async () => {
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

    const updateResponse = await supertest(app.express)
      .post("/site/user/update")
      .set("Cookie", [jwtCookie])
      .send({
        params: { username: "admin" },
        data: {
          username: "admin-one",
          password: "password",
          displayName: "Administrator 01",
          email: "admin.01@example.com",
        },
      });

    const getResponse = await supertest(app.express)
      .post("/site/user/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { username: "admin-one" },
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      status: "OK",
      data: {
        username: "admin-one",
      },
    });

    expect(getResponse.body).toEqual({
      status: "OK",
      data: {
        username: "admin-one",
        displayName: "Administrator 01",
        email: "admin.01@example.com",
      },
    });
  });
});
