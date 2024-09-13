import { App, Configuration, Context } from "../../main";
import { runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/page/get", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404 if page doens't exist", async () => {
    const response = await supertest(app.express)
      .post("/site/page/get")
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

  it("should response with correct page entity", async () => {
    await supertest(app.express)
      .post("/site/page/create")
      .send({
        data: {
          key: "c-intro",
          title: "C Programming Language Introduction",
          description: "This is a C programing language introduction",
          urlPattern: "/articles/c-intro",
          details: { foo: "bar" },
        },
      });

    const response = await supertest(app.express)
      .post("/site/page/get")
      .send({
        params: { key: "c-intro" },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "c-intro",
        title: "C Programming Language Introduction",
        description: "This is a C programing language introduction",
        urlPattern: "/articles/c-intro",
        details: { foo: "bar" },
      },
    });
  });
});
