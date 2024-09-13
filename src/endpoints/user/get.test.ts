import { App, Configuration, Context } from "../../main";
import { runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/user/get", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  it("should response with 404, if the user doesn't exist", async () => {
    const response = await supertest(app.express)
      .post("/site/user/get")
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

    const response = await supertest(app.express)
      .post("/site/user/get")
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
