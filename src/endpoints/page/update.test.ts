import { App, Configuration, Context } from "../../main";
import supertest from "supertest";

describe("/site/page/update", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await app.context.database.db().collection("pages").drop();
  });

  it("if the page not exist", async () => {
    const response = await supertest(app.express)
      .post("/site/page/update")
      .send({
        params: {
          key: "c++",
        },
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "INVALID_PARAMS",
      message: expect.any(String),
    });
  });

  it("update the page", async () => {
    await supertest(app.express)
      .post("/site/page/create")
      .send({
        data: {
          key: "nim",
          title: "Nim program language",
          description: "This is Nim program note",
          urlPattern: "/articles/nim",
          details: { foo: "bar" },
        },
      });

    const response = await supertest(app.express)
      .post("/site/page/update")
      .send({
        params: {
          key: "nim",
        },
        data: {
          title: "Nim program language and is a static language",
          description: "This is Nim program note",
          urlPattern: "/articles/nim",
          details: { foo: "bar" },
        },
      });

    const getResponse = await supertest(app.express)
      .post("/site/page/get")
      .send({
        params: {
          key: "nim",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "nim",
      },
    });

    expect(getResponse.body).toEqual({
      status: "OK",
      data: {
        key: "nim",
        title: "Nim program language and is a static language",
        description: "This is Nim program note",
        urlPattern: "/articles/nim",
        details: { foo: "bar" },
      },
    });
  });
});
