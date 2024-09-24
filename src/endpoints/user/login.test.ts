import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/user/login", () => {
  let app: App<Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);

    jest.useFakeTimers({
      doNotFake: ["nextTick"],
      now: new Date("2024-09-01T00:00:00.000Z"),
    });
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should sign out token if user exists in configuration", async () => {
    const response = await supertest(app.express)
      .post("/site/user/login")
      .send({
        data: {
          username: "testuser",
          password: "no-password",
        },
      });

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toEqual([
      "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNzI1MTQ4ODAwLCJuYmYiOjE3MjUxNDg4MDAsImV4cCI6MTcyNTE1MjQwMH0.Xz49egE33ynVqyhlQX8Qmw795cG86aH6b5Yd6kzBv-A; Max-Age=3600; Domain=localhost; Path=/; Expires=Sun, 01 Sep 2024 01:00:00 GMT; HttpOnly",
    ]);
    expect(response.body).toEqual({
      status: "OK",
    });
  });

  it("should sign out token if user exists in database", async () => {
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
      .post("/site/user/login")
      .send({
        data: {
          username: "admin",
          password: "password",
        },
      });

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toEqual([
      "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzI1MTQ4ODAwLCJuYmYiOjE3MjUxNDg4MDAsImV4cCI6MTcyNTE1MjQwMH0.T6qqarFz02HDwixtiuvq_RQ3U1U1_34p7gVWhWxYZ48; Max-Age=3600; Domain=localhost; Path=/; Expires=Sun, 01 Sep 2024 01:00:00 GMT; HttpOnly",
    ]);
    expect(response.body).toEqual({
      status: "OK",
    });
  });
});
