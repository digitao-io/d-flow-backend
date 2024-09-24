import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/page/create", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should return newly inserted page key", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/page/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "c-intro",
          title: "C Programming Language Introduction",
          description: "This is a C programing language introduction",
          urlPattern: "/articles/c-intro",
          details: { foo: "bar" },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "c-intro",
      },
    });
  });
});
