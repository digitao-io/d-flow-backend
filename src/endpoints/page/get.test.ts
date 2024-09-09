import { App, Configuration, Context } from "../../main";
import supertest from "supertest";

describe("/site/page/get", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await app.context.database.db().collection("pages").drop();
  });

  it("rejects if the page not exist", async () => {
    const response = await supertest(app.express)
      .post("/site/page/get")
      .send({
        params: {
          key: "C++",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: null,
    });
  });

  it("returns page entity", async () => {
    await supertest(app.express)
      .post("/site/page/create")
      .send({
        data: {
          key: "Nim",
          title: "Nim program language",
          description: "This is Nim program note",
          urlPattern: "This urlPattern",
          details: "The Nim program language is a static language.",
        },
      });

    const response = await supertest(app.express)
      .post("/site/page/get")
      .send({
        parameters: {
          key: "Nim",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "Nim",
        title: "Nim program language",
        description: "This is Nim program note",
        urlPattern: "This urlPattern",
        details: "The Nim program language is a static language.",
      },
    });
  });
});
