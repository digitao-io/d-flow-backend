import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/api/site/file/create", () => {
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
      .post("/api/site/file/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "upload.test.jpg",
          description: "upload jpg priture.",
          mimeType: "image/jpg",
          sizeInBytes: 14679,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "upload.test.jpg",
      },
    });
  });
});
