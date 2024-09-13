import { App, Configuration, Context } from "../../main";
import supertest from "supertest";

describe("/site/user/list", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await app.context.database.db().collection("users").drop();
  });

  it("if the user is empty", async () => {
    const response = await supertest(app.express)
      .post("/site/user/list");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [],
    });
  });

  it("returns user all entity", async () => {
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

    await supertest(app.express)
      .post("/site/user/create")
      .send({
        data: {
          username: "admin2",
          password: "password2",
          displayName: "Database name is admin",
          email: "longlong@gmail.com",
        },
      });

    const response = await supertest(app.express)
      .post("/site/user/list");

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          username: "admin",
          password: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
          displayName: "Database name is admin",
          email: "sing@gmail.com",
        },
        {
          username: "admin2",
          password: "password2",
          displayName: "Database name is admin",
          email: "longlong@gmail.com",
        },
      ],
    });
  });
});
