import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/user/create", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with newly inserted username", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
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

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        username: "admin",
      },
    });
  });
});
