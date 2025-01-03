import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/file/list", () => {
  let app: App< Context<Configuration>, Configuration>;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with an empty array if there is no file", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/file/list")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          sortBy: "createdAt",
          sortOrder: "DESC",
          itemsPerPage: 1,
          page: 1,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [],
      total: 0,
    });
  });

  it("should return all files without filters", async () => {
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
          key: "c-tech.mp4",
          description: "C Programming Language learning video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
        },
      });

    await supertest(app.express)
      .post("/site/file/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "cpp-tech.webm",
          description: "CPP Programming Language learning video",
          mimeType: "video/webm",
          sizeInBytes: 13,
        },
      });

    const response = await supertest(app.express)
      .post("/site/file/list")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          sortBy: "createdAt",
          sortOrder: "DESC",
          itemsPerPage: 5,
          page: 1,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          key: "c-tech.mp4",
          description: "C Programming Language learning video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
          createdAt: "2024-09-01T00:00:00.000Z",
        },
        {
          key: "cpp-tech.webm",
          description: "CPP Programming Language learning video",
          mimeType: "video/webm",
          sizeInBytes: 13,
          createdAt: "2024-09-01T00:00:00.000Z",
        },
      ],
      total: 2,
    });
  });

  it("should filter results by key", async () => {
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
          key: "c-tech.mp4",
          description: "C Programming Language learning video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
        },
      });

    await supertest(app.express)
      .post("/site/file/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "cpp-tech.webm",
          description: "CPP Programming Language learning video",
          mimeType: "video/webm",
          sizeInBytes: 13,
        },
      });

    const response = await supertest(app.express)
      .post("/site/file/list")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          key: "cpp",
          sortBy: "createdAt",
          sortOrder: "DESC",
          itemsPerPage: 5,
          page: 1,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          key: "cpp-tech.webm",
          description: "CPP Programming Language learning video",
          mimeType: "video/webm",
          sizeInBytes: 13,
          createdAt: "2024-09-01T00:00:00.000Z",
        },
      ],
      total: 1,
    });
  });

  it("should filter results by mime type", async () => {
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
          key: "c-tech.mp4",
          description: "C Programming Language learning video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
        },
      });

    await supertest(app.express)
      .post("/site/file/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "cpp-tech.webm",
          description: "CPP Programming Language learning video",
          mimeType: "video/webm",
          sizeInBytes: 13,
        },
      });

    const response = await supertest(app.express)
      .post("/site/file/list")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          mimeType: "video/webm",
          sortBy: "createdAt",
          sortOrder: "DESC",
          itemsPerPage: 5,
          page: 1,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          key: "cpp-tech.webm",
          description: "CPP Programming Language learning video",
          mimeType: "video/webm",
          sizeInBytes: 13,
          createdAt: "2024-09-01T00:00:00.000Z",
        },
      ],
      total: 1,
    });
  });
});
