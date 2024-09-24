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
      .post("/site/file/list-all")
      .set("Cookie", [jwtCookie]);

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

    await supertest(app.express)
      .post("/site/file/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "cpp-teache.webp",
          description: "Cpp Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 13,
        },
      });

    const response = await supertest(app.express)
      .post("/site/file/list-all")
      .set("Cookie", [jwtCookie]);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: [
        {
          key: "c-teache.jpg",
          description: "C Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
          createdAt: "2024-09-01T00:00:00.000Z",
        },
        {
          key: "cpp-teache.webp",
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
