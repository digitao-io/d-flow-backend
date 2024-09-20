import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
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
    jest.useFakeTimers({
      doNotFake: ["nextTick"],
      now: new Date("2024-01-01T00:00:00.000Z"),
    });

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

    await supertest(app.express)
      .post("/site/page/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "cpp-intro",
          title: "C++ Programming Language Introduction",
          description: "This is a C++ programing language introduction",
          urlPattern: "/articles/cpp-intro",
          details: { foo: "bar" },
        },
      });

    const response = await supertest(app.express)
      .post("/site/page/list-all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          key: "c-intro",
          title: "C Programming Language Introduction",
          description: "This is a C programing language introduction",
          urlPattern: "/articles/c-intro",
          details: { foo: "bar" },
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
          key: "cpp-intro",
          title: "C++ Programming Language Introduction",
          description: "This is a C++ programing language introduction",
          urlPattern: "/articles/cpp-intro",
          details: { foo: "bar" },
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ],
      total: 2,
    });
  });
});
