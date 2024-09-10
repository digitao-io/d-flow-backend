import { App, Configuration, Context } from "../../main";
import supertest from "supertest";

describe("/site/page/list", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await app.context.database.db().collection("pages").drop();
  });

  it("if the page is empty", async () => {
    const response = await supertest(app.express)
      .post("/site/page/list");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [],
    });
  });

  it("returns page all entity", async () => {
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

    await supertest(app.express)
      .post("/site/page/create")
      .send({
        data: {
          key: "cpp",
          title: "cpp program language",
          description: "This is cpp program note",
          urlPattern: "/page/cpp",
          details: { details: "cpp" },
        },
      });

    const response = await supertest(app.express)
      .post("/site/page/list");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          key: "c",
          title: "C program language",
          description: "This is C program note",
          urlPattern: "/page/articles-c",
          details: { details: "C" },
        },
        {
          key: "cpp",
          title: "cpp program language",
          description: "This is cpp program note",
          urlPattern: "/page/cpp",
          details: { details: "cpp" },
        },
      ],
    });
  });
});
