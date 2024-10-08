import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/file/create", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should return newly inserted file key", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
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

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "c-teache.jpg",
      },
    });
  });
});
