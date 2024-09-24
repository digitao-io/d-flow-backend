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

  });

  it("should response with 404 if file metadata not created", async () => {

  });

  it("should response with 400 if the file parameters doesn't match the metadata", async () => {

  });

  it("should upload the file", async () => {
    const jwtCookie = await getAuthCookie(app);

    await supertest(app.express)
      .post("/site/file/create")
      .set("Cookie", [jwtCookie])
      .send("...");

    const response = await supertest(app.express)
      .post("/site/file/upload/upload.test.jpg")
      .set("Cookie", [jwtCookie])
      .attach("file", path.join(__dirname, "upload.test.jpg"));
  });
});
