import { App, Configuration, Context } from "../../main";
import { runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/file/update", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404 if the file doens't exist", async () => {
    const response = await supertest(app.express)
      .post("/site/file/update")
      .send({
        params: {
          key: "c-teache",
        },
        data: {
          key: "cpp-teache",
          description: "Cpp Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
        },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File with key c-teache doesn't exist",
    });
  });

  it("should update the file correctly", async () => {
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

    jest.useFakeTimers({
      doNotFake: ["nextTick"],
      now: new Date("2024-09-02T00:00:00.000Z"),
    });

    const updateResponse = await supertest(app.express)
      .post("/site/file/update")
      .send({
        params: {
          key: "c-teache",
        },
        data: {
          key: "cpp-teache",
          description: "Cpp Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 13,
        },
      });

    const getResponse = await supertest(app.express)
      .post("/site/file/get")
      .send({
        params: { key: "cpp-teache" },
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      status: "OK",
      data: {
        key: "cpp-teache",
      },
    });

    expect(getResponse.body).toEqual({
      status: "OK",
      data: {
        key: "cpp-teache",
        description: "Cpp Programming Language learn video",
        mimeType: "video/mp4",
        sizeInBytes: 13,
        createdAt: "2024-09-02T00:00:00.000Z",
      },
    });
  });
});
