import { App, Configuration, Context } from "../../main";
import { runAfterEach, runBeforeEach } from "../../test/testutils";
import * as supertest from "supertest";

describe("/site/file/create", () => {
  let app: App< Context<Configuration>, Configuration >;

  beforeEach(async () => {
    app = await runBeforeEach();
  });

  afterEach(async () => {
    await runAfterEach(app);
  });

  it("should return newly inserted file key", async () => {
    const response = await supertest(app.express)
      .post("/site/file/create")
      .send({
        data: {
          key: "c-teache",
          description: "C Programming Language learn video",
          mimeType: "video/mp4",
          sizeInBytes: 12,
        },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
      data: {
        key: "c-teache",
      },
    });
  });
});
