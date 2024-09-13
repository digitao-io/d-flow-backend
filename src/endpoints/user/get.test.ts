import { App, Configuration, Context } from "../../main";
import supertest from "supertest";

describe("/site/user/get", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await app.context.database.db().collection("users").deleteMany();
  });

  it("rejects if the user not exist", async () => {
    const response = await supertest(app.express)
      .post("/site/user/get")
      .send({
        params: { },
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "INVALID_PARAMS",
      message: expect.any(String),
    });
  });

  it("returns user entity", async () => {
    await supertest(app.express)
      .post("/site/user/create")
      .send({
        data: {
          username: "admin",
          password: "password",
          displayName: "Database name is admin",
          email: "sing@gmail.com",
        },
      });

    const response = await supertest(app.express)
      .post("/site/user/get")
      .send({
        params: {
          username: "admin",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        username: "admin",
        password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
        displayName: "Database name is admin",
        email: "sing@gmail.com",
      },
    });
  });
});
