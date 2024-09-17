import { App, Configuration, Context } from "../../main";
import { runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/file/delete", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404, if the file doesn't exist", async () => {
    const response = await supertest(app.express)
      .post("/site/file/delete")
      .send({
        params: { key: "cteache" },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File with key cteache doesn't exist",
    });
  });

  it("should delete file correctly", async () => {
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

    const deleteResponse = await supertest(app.express)
      .post("/site/file/delete")
      .send({
        params: { key: "c-teache" },
      });

    const getResponse = await supertest(app.express)
      .post("/site/file/get")
      .send({
        params: { key: "c-teache" },
      });

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      status: "OK",
      data: {
        key: "c-teache",
      },
    });

    expect(getResponse.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: expect.any(String),
    });
  });
});
