import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/user/list-all", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should return empty array, if there is no user", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/user/list-all")
      .set("Cookie", [jwtCookie]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [],
      total: 0,
    });
  });

  it("should response with all users", async () => {
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

    await supertest(app.express)
      .post("/site/user/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          username: "john-doe",
          password: "password2",
          displayName: "John Doe",
          email: "john.doe@example.com",
        },
      });

    const response = await supertest(app.express)
      .post("/site/user/list-all")
      .set("Cookie", [jwtCookie]);

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
