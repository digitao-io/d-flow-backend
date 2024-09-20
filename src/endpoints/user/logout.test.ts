import { App, Configuration, Context } from "../../main";
import { runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/user/logout", () => {
  let app: App<Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = await runBeforeEach();

    jest.useFakeTimers({
      doNotFake: ["nextTick"],
      now: new Date("2024-09-01T00:00:00.000Z"),
    });
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should log out of account", async () => {
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
      .post("/site/user/login")
      .send({
        data: {
          username: "admin",
          password: "password",
        },
      });

    const response = await supertest(app.express)
      .post("/site/user/logout");

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toEqual([
      "jwt=; Max-Age=0; Path=/; Expires=Sun, 01 Sep 2024 00:00:00 GMT; HttpOnly",
    ]);
    expect(response.body).toEqual({
      status: "OK",
    });
  });
});
