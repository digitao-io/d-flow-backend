import path from "node:path";
import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/api/site/file/delete", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404, if the file doesn't exist", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/api/site/file/delete")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "upload.test.jpg" },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File with key upload.test.jpg doesn't exist",
    });
  });

  it("should delete file correctly", async () => {
    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
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

    await supertest(app.express)
      .post("/api/site/file/upload/upload.test.jpg")
      .set("Cookie", [jwtCookie])
      .attach("file", path.join(__dirname, "upload.test.jpg"));

    const deleteResponse = await supertest(app.express)
      .post("/api/site/file/delete")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "upload.test.jpg" },
      });

    const getResponse = await supertest(app.express)
      .post("/api/site/file/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "upload.test.jpg" },
      });

    const downloadResponse = await supertest(app.express)
      .get("/api/site/file/download/upload.test.jpg");

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      status: "OK",
      data: {
        key: "upload.test.jpg",
      },
    });

    expect(getResponse.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: expect.any(String),
    });

    expect(downloadResponse.status).toBe(404);
    expect(downloadResponse.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File doesn't exist",
    });
  });
});
