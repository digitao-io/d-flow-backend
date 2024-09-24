import { App, Configuration, Context } from "../../main";
import { getAuthCookie, runAfterEach, runBeforeEach } from "../../test/testutils";
import supertest from "supertest";

describe("/site/file/delete", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should response with 404, if the file doesn't exist", async () => {
    const jwtCookie = await getAuthCookie(app);

    const response = await supertest(app.express)
      .post("/site/file/delete")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "cteache.gif" },
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: "File with key cteache.gif doesn't exist",
    });
  });

  it("should delete file correctly", async () => {
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

    const deleteResponse = await supertest(app.express)
      .post("/site/file/delete")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "c-teache.jpg" },
      });

    const getResponse = await supertest(app.express)
      .post("/site/file/get")
      .set("Cookie", [jwtCookie])
      .send({
        params: { key: "c-teache.jpg" },
      });

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({
      status: "OK",
      data: {
        key: "c-teache.jpg",
      },
    });

    expect(getResponse.body).toEqual({
      status: "FAILED",
      error: "ENTITY_NOT_FOUND",
      message: expect.any(String),
    });
  });
});
