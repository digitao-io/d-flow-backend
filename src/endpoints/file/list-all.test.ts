import { App, Configuration, Context } from "../../main";
import { runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/file/list", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with an empty array if there is no file", async () => {
    const response = await supertest(app.express)
      .post("/site/file/list-all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [],
      total: 0,
    });
  });

  it("should return all files", async () => {
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

    await supertest(app.express)
      .post("/site/file/create")
      .send({
        data: {
          key: "cpp-teache",
          description: "Cpp Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 13,
        },
      });

    const response = await supertest(app.express)
      .post("/site/file/list-all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          key: "c-teache",
          description: "C Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
          createdAt: "2024-09-01T00:00:00.000Z",
        },
        {
          key: "cpp-teache",
          description: "Cpp Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 13,
          createdAt: "2024-09-01T00:00:00.000Z",
        },
      ],
      total: 2,
    });
  });
});
