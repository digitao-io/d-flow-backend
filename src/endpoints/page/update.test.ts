import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/page/update", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404 if the page doens't exist", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/page/update")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          key: "c-intro",
        },
        data: {
          key: "c-lang-intro",
          title: "An Introduction to C Programming Language",
          description: "This is a C programing language introduction",
          urlPattern: "/articles/c-lang-intro",
          details: { foo: "bar" },
        },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "Page with key c-intro doesn't exist",
    });
  });

  it("should update the page correctly", async () => {
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

    jest.useFakeTimers({
      doNotFake: ["nextTick"],
      now: new Date("2024-01-01T00:05:00.000Z"),
    });

    const updateResponse = await supertest(app.express)
      .post("/site/page/update")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          key: "c-intro",
        },
        data: {
          key: "c-lang-intro",
          title: "An Introduction to C Programming Language",
          description: "This is a C programing language introduction",
          urlPattern: "/articles/c-lang-intro",
          details: { foo: "bar" },
        },
      });

    const getResponse = await supertest(app.express)
      .post("/site/page/get")
      .send({
        params: { key: "c-lang-intro" },
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      status: "OK",
      data: {
        key: "c-lang-intro",
      },
    });

    expect(getResponse.body).toEqual({
      status: "OK",
      data: {
        key: "c-lang-intro",
        title: "An Introduction to C Programming Language",
        description: "This is a C programing language introduction",
        urlPattern: "/articles/c-lang-intro",
        details: { foo: "bar" },
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:05:00.000Z",
      },
    });
  });
});
