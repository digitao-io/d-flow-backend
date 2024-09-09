import { App, Configuration, Context } from "../../main";
import supertest from "supertest";

describe("/site/page/create", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await app.context.database.db().collection("pages").drop();
  });

  it("returns newly inserted page key", async () => {
    const response = await supertest(app.express)
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

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "c",
      },
    });
  });
});
