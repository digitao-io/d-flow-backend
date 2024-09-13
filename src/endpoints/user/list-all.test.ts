import { App, Configuration, Context } from "../../main";
import { runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/user/list-all", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  it("should return empty array, if there is no user", async () => {
    const response = await supertest(app.express)
      .post("/site/user/list-all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [],
      total: 0,
    });
  });

  it("should response with all users", async () => {
    await supertest(app.express)
      .post("/site/user/create")
      .send({
        data: {
          username: "admin",
          password: "password",
          displayName: "Administrator",
          email: "admin@example.com",
        },
      });

    await supertest(app.express)
      .post("/site/user/create")
      .send({
        data: {
          username: "john-doe",
          password: "password2",
          displayName: "John Doe",
          email: "john.doe@example.com",
        },
      });

    const response = await supertest(app.express)
      .post("/site/user/list-all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          username: "admin",
          displayName: "Administrator",
          email: "admin@example.com",
        },
        {
          username: "john-doe",
          displayName: "John Doe",
          email: "john.doe@example.com",
        },
      ],
      total: 2,
    });
  });
});
