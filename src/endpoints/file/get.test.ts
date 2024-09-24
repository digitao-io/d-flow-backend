import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/file/get", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404 if file donse't exist", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/file/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "c-teache.jpg" },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File with key c-teache.jpg doesn't exist",
    });
  });

  it("should response with correct file entity", async () => {
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

    const response = await supertest(app.express)
      .post("/site/file/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "c-teache.jpg" },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "c-teache.jpg",
        description: "C Programming Language learn video",
        mimeType: "video/mp4",
        sizeInBytes: 12,
        createdAt: "2024-09-01T00:00:00.000Z",
      },
    });
  });
});
