import * as path from "node:path";
import * as supertest from "supertest";
import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";

describe("/site/file/upload", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 401 if user not logged in", async () => {
    const response = await supertest(app.express)
      .post("/site/file/upload/upload.test.jpg")
      .attach("file", path.join(__dirname, "upload.test.jpg"));

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "AUTH_FAILED",
      message: "Authorization failed",
    });
  });

  it("should response with 404 if file metadata not created", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/file/upload/upload.test.jpg")
      .set("Cookie", [jwtCookie])
      .attach("file", path.join(__dirname, "upload.test.jpg"));

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File metadata doesn't exist",
    });
  });

  it("should response with 400 if the file parameters doesn't match the metadata", async () => {
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

    const response = await supertest(app.express)
      .post("/site/file/upload/upload.test.jpg")
      .set("Cookie", [jwtCookie])
      .attach("file", path.join(__dirname, "upload.test.jpg"));

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "INVALID_PARAMS",
      message: "Uploaded file doesn't match the file metadata",
    });
  });

  it("should upload the file", async () => {
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
      .post("/site/file/upload/upload.test.jpg")
      .set("Cookie", [jwtCookie])
      .attach("file", path.join(__dirname, "upload.test.jpg"));

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
    });
  });
});
