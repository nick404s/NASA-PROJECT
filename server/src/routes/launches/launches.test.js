const request = require("supertest");
const app = require("../../app");

// connection to the mongo db
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

const VERSION_PATH = "/v1";

// describe the test suite
describe("Launches API", () => {
  // setup the mongo db connection first
  beforeAll(async () => {
    await mongoConnect();
  });

  // teardown the mongo db connection after the test
  afterAll(async () => {
    await mongoDisconnect();
  });

  // GET the launches test
  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get(`${VERSION_PATH}/launches`)
        .expect("Content-Type", /json/) // regex to check if the response is json
        .expect(200);
    });
  });

  // POST a launch test
  describe("Test POST /launch", () => {
    const completeLaunchObject = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-1652 b",
      launchDate: "January 4, 2030",
    };

    const launchObjectWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-1652 b",
    };

    const launchObjectWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-1652 b",
      launchDate: "invalid date",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post(`${VERSION_PATH}/launches`)
        .send(completeLaunchObject)
        .expect("Content-Type", /json/)
        .expect(201); // 201 - created

      // put the request and response dates into numerical representation
      const requestDate = new Date(completeLaunchObject.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      // check if the request date is equal to the response date using jest
      expect(responseDate).toBe(requestDate);

      // check if the response body has the data we sent
      // dates are in different format so it's impossible compare them directly
      expect(response.body).toMatchObject(launchObjectWithoutDate);
    });

    // test if the request with a missing property returns 400 bad request
    // and the error object is as expected
    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post(`${VERSION_PATH}/launches`)
        .send(launchObjectWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    // test if the request with an invalid date returns 400 bad request
    // and the error object is as expected
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post(`${VERSION_PATH}/launches`)
        .send(launchObjectWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
