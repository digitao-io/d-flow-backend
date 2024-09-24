import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/page/delete", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404, if the page doesn't exist", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/page/delete")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "c-intro" },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "Page with key c-intro doesn't exist",
    });
  });

  it("should delete page correctly", async () => {
    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
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

    const deleteResponse = await supertest(app.express)
      .post("/site/page/delete")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "c-intro" },
      });

    const getResponse = await supertest(app.express)
      .post("/site/page/get")
      .send({
        params: { key: "c-intro" },
      });

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      status: "OK",
      data: {
        key: "c-intro",
      },
    });

    expect(getResponse.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: expect.any(String),
    });
  });
});
