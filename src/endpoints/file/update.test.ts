import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/file/update", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404 if the file doens't exist", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/file/update")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          key: "c-teache.jpg",
        },
        data: {
          key: "cpp-teache.jpg",
          description: "Cpp Programming Language learn video",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File with key c-teache.jpg doesn't exist",
    });
  });

  it("should update the file correctly", async () => {
    jest.useFakeTimers({
      doNotFake: ["nextTick"],
      now: new Date("2024-09-01T00:00:00.000Z"),
    });

    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
      .post("/site/file/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "c-teache.jpg",
          description: "C Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
        },
      });

    const updateResponse = await supertest(app.express)
      .post("/site/file/update")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          key: "c-teache.jpg",
        },
        data: {
          key: "cpp-teache.jpg",
          description: "Cpp Programming Language learn video",
        },
      });

    const getResponse = await supertest(app.express)
      .post("/site/file/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "cpp-teache.jpg" },
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      status: "OK",
      data: {
        key: "cpp-teache.jpg",
      },
    });

    expect(getResponse.body).toEqual({
      status: "OK",
      data: {
        key: "cpp-teache.jpg",
        description: "Cpp Programming Language learn video",
        mimeType: "video/mp4",
        sizeInBytes: 12,
        createdAt: "2024-09-01T00:00:00.000Z",
      },
    });
  });
});
