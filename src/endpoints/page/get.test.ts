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
          key: "cpp",
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
          key: "nim",
          title: "Nim program language",
          description: "This is Nim program note",
          urlPattern: "/articles/nim",
          details: { details: "Nim" },
        },
      });

    const response = await supertest(app.express)
      .post("/site/page/get")
      .send({
        parameters: {
          key: "nim",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "nim",
        title: "Nim program language",
        description: "This is Nim program note",
        urlPattern: "/articles/nim",
        details: { details: "Nim" },
      },
    });
  });
});
