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
    components: {
      securitySchemes: {
        Authorization: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          value: "Bearer <JWT token here>",
        },
      },
    },
  },
  tags: [
    {
      name: "User",
      description: "API for users",
    },
    {
      name: "Location",
      description: "API for locations",
    },
  ],
  apis: [
    "src/models/*.ts",
    "src/utils/helpers/*.ts",
    "src/api/controllers/user/*.ts",
    "src/api/controllers/user/auth/*.ts",
    "src/api/controllers/location/*.ts",
  ],
};
