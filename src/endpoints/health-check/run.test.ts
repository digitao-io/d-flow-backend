import { App } from "../../main";
import supertest from "supertest";

describe("/site/health-check/run", () => {
  it("should response correctly", async () => {
    const app = new App();
    await app.initialize({ configPath: "./config.test.json" });

    const response = await supertest(app.express)
      .post("/site/health-check/run");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "OK",
    });
  });
});
