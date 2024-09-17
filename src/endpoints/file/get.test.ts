import { App, Configuration, Context } from "../../main";
import { runAfterEach, runBeforeEach } from "../../test/testutils";
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
    const response = await supertest(app.express)
      .post("/site/file/get")
      .send({
        params: { key: "c-teache" },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File with key c-teache doesn't exist",
    });
  });

  it("should response with correct file entity", async () => {
    jest.useFakeTimers({
      doNotFake: ["nextTick"],
      now: new Date("2024-09-01T00:00:00.000Z"),
    });

    await supertest(app.express)
      .post("/site/file/create")
      .send({
        data: {
          key: "c-teache",
          description: "C Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
        },
      });

    const response = await supertest(app.express)
      .post("/site/file/get")
      .send({
        params: { key: "c-teache" },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "c-teache",
        description: "C Programming Language learn video",
        mimeType: "video/mp4",
        sizeInBytes: 12,
        createdAt: "2024-09-01T00:00:00.000Z",
      },
    });
  });
});
