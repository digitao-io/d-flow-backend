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

  it("should return 404 if the file metadata is not created", async () => {

  });

  it("should return 404 if the file is not uploaded", async () => {

  });

  it("should return file content", async () => {

  });
});
