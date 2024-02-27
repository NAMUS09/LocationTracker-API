export default {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "LocationTracker API",
      version: "1.0.0",
      description:
        "The API documentation of a LocationTracker RESTful APIs using Node.js, Express, and Mongoose.",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/",
      },
    },
    basePath: "/api/v1",
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },
  tags: [
    {
      name: "User",
      description: "API for users",
    },
  ],
  apis: [
    "src/models/*.js",
    "src/utils/helpers/*.js",
    "src/api/controllers/user/*.js",
    "src/api/controllers/user/auth/*.js",
  ],
};
