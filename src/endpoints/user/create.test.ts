import { App, Configuration, Context } from "../../main";
import supertest from "supertest";

describe("/site/user/create", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await app.context.database.db().collection("users").deleteMany();
  });

  it("returns newly inserted username", async () => {
    const response = await supertest(app.express)
      .post("/site/user/create")
      .send({
        data: {
          username: "admin",
          password: "password",
          displayName: "Database name is admin",
          email: "sing@gmail.com",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        username: "admin",
      },
    });
  });
});
