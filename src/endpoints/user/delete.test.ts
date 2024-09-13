import { App, Configuration, Context } from "../../main";
import { runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/user/delete", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  it("should response with 404, if the user doesn't exist", async () => {
    const response = await supertest(app.express)
      .post("/site/user/delete")
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

  it("should delete a user entity", async () => {
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

    const deleteResponse = await supertest(app.express)
      .post("/site/user/delete")
      .send({
        params: { username: "admin" },
      });

    const getResponse = await supertest(app.express)
      .post("/site/user/get")
      .send({
        params: { username: "admin" },
      });

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      status: "OK",
      data: {
        username: "admin",
      },
    });

    expect(getResponse.status).toBe(404);
  });
});
