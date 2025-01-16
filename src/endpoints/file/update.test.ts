import path from "node:path";
import fs from "node:fs";
import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";
import { patterns } from "../../app/pattern";

describe("/api/site/file/update", () => {
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
      .post("/api/site/file/update")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          key: "upload.test.jpg",
        },
        data: {
          key: "upload.jpg",
          description: "upload jpg priture.",
        },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File with key upload.test.jpg doesn't exist",
    });
  });

  it("should update the file correctly", async () => {
    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
      .post("/api/site/file/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "upload.test.jpg",
          description: "upload jpg priture.",
          mimeType: "image/jpeg",
          sizeInBytes: 14679,
        },
      });

    await supertest(app.express)
      .post("/api/site/file/upload/upload.test.jpg")
      .set("Cookie", [jwtCookie])
      .attach("file", path.join(__dirname, "upload.test.jpg"));

    const updateResponse = await supertest(app.express)
      .post("/api/site/file/update")
      .set("Cookie", [jwtCookie])
      .send({
        params: {
          key: "upload.test.jpg",
        },
        data: {
          key: "upload.jpg",
          description: "Just another test file.",
        },
      });

    const getResponse = await supertest(app.express)
      .post("/api/site/file/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "upload.jpg" },
      });

    const downloadResponse = await supertest(app.express)
      .get("/api/site/file/download/upload.jpg");

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual({
      status: "OK",
      data: {
        key: "upload.jpg",
      },
    });

    expect(getResponse.body).toEqual({
      status: "OK",
      data: {
        key: "upload.jpg",
        description: "Just another test file.",
        mimeType: "image/jpeg",
        sizeInBytes: 14679,
        createdAt: expect.stringMatching(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/),
      },
    });

    expect(downloadResponse.status).toBe(200);
    expect(downloadResponse.headers["content-type"]).toBe("image/jpeg");
    expect(downloadResponse.headers["content-length"]).toBe("14679");
    expect(downloadResponse.body).toEqual(fs.readFileSync(path.join(__dirname, "upload.test.jpg")));
  });
});
