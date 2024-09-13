import { App, Configuration, Context } from "../../main";
import { runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/page/list", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with an empty array if there is no page", async () => {
    const response = await supertest(app.express)
      .post("/site/page/list-all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [],
      total: 0,
    });
  });

  it("should return all pages", async () => {
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
      .post("/site/page/list-all");

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
      total: 2,
    });
  });
});
