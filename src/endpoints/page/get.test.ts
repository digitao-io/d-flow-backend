import { App, Configuration, Context } from "../../main";
import { runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/page/get", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  it("rejects if the page not exist", async () => {
    const response = await supertest(app.express)
      .post("/site/page/get")
      .send({
        params: { },
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "INVALID_PARAMS",
      message: expect.any(String),
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
          details: { foo: "bar" },
        },
      });

    const response = await supertest(app.express)
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
        title: "Nim program language",
        description: "This is Nim program note",
        urlPattern: "/articles/nim",
        details: { foo: "bar" },
      },
    });
  });
});
