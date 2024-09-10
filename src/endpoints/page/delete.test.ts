import { App, Configuration, Context } from "../../main";
import supertest from "supertest";

describe("/site/page/delete", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await app.context.database.db().collection("pages").drop();
  });

  it("if the page not exist", async () => {
    const response = await supertest(app.express)
      .post("/site/page/delete")
      .send({
        params: {},
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "INVALID_PARAMS",
      message: expect.any(String),
    });
  });

  it("delete a page entity", async () => {
    await supertest(app.express)
      .post("/site/page/create")
      .send({
        data: {
          key: "c",
          title: "C program language",
          description: "This is C program note",
          urlPattern: "/page/articles-c",
          details: { details: "C" },
        },
      });

    const response = await supertest(app.express)
      .post("/site/page/delete")
      .send({
        params: {
          key: "c",
        },
      });

    const getResponse = await supertest(app.express)
      .post("/site/page/get")
      .send({
        params: {
          key: "c",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "c",
      },
    });

    expect(getResponse.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: expect.any(String),
    });
  });
});
