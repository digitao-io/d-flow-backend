import fs from "node:fs";
import path from "node:path";
import supertest from "supertest";
import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";

describe("/site/file/download", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = new App();
    await app.initialize({ configPath: "./config.test.json" });
    await runBeforeEach(app);
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should return 404 if the file metadata is not created", async () => {
    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
      .post("/site/file/create")
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
      .post("/site/file/upload/upload.test.jpg")
      .set("Cookie", [jwtCookie])
      .attach("file", path.join(__dirname, "upload.test.jpg"));

    const response = await supertest(app.express)
      .get("/site/file/download/upload.test.jpg");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File doesn't exist",
    });
  });

  it("should return 404 if the file is not uploaded", async () => {
    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
      .post("/site/file/create")
      .set("Cookie", [jwtCookie])
      .send({
        data: {
          key: "upload.test.jpg",
          description: "upload jpg priture.",
          mimeType: "image/jpeg",
          sizeInBytes: 14679,
        },
      });

    const response = await supertest(app.express)
      .get("/site/file/download/upload.test.jpg");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File doesn't exist",
    });
  });

  it("should return file content", async () => {
    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
      .post("/site/file/create")
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
      .post("/site/file/upload/upload.test.jpg")
      .set("Cookie", [jwtCookie])
      .attach("file", path.join(__dirname, "upload.test.jpg"));

    const response = await supertest(app.express)
      .get("/site/file/download/upload.test.jpg");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("image/jpeg");
    expect(response.headers["content-length"]).toBe("14679");
    expect(response.body).toEqual(fs.readFileSync(path.join(__dirname, "upload.test.jpg")));
  });
});
