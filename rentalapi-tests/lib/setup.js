const axios = require("axios/dist/node/axios.cjs");
const https = require("https");
const REMOTE_API_URL = require("../api");
const { v4: uuid } = require("uuid");
const { faker } = require("@faker-js/faker");
const { DateTime } = require("luxon");

const instance = axios.create({
  baseURL: REMOTE_API_URL,
  adapter: "http",
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const userOne = {
  email: `${uuid()}@fake-email.com`,
  password: "webcomputing1",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: faker.address.streetAddress(),
  dob: DateTime.fromJSDate(faker.date.past()).toISODate(),
};

const userTwo = {
  email: `${uuid()}@fake-email.com`,
  password: "webcomputing2",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: faker.address.streetAddress(),
  dob: DateTime.fromJSDate(faker.date.past()).toISODate(),
};

const userThree = {
  email: `${uuid()}@fake-email.com`,
  password: "webcomputing3",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: faker.address.streetAddress(),
  dob: DateTime.fromJSDate(faker.date.past()).toISODate(),
};

const nonExistentUser = {
  email: `${uuid()}@fake-email.com`,
  password: "webcomputing2",
};

// Long comment (2004 characters)
const longComment = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo nisi vel nunc elementum, varius pellentesque dolor mattis. Nulla mollis felis posuere tellus interdum ultricies. Vestibulum placerat fermentum tristique. Nulla efficitur quam quis eros interdum egestas. Fusce fringilla diam leo, sed tempus odio placerat quis. Pellentesque in fringilla tellus, a gravida mi. Duis eleifend placerat commodo. Mauris vitae orci at augue pharetra egestas ac quis lectus. Proin fermentum molestie erat id congue. Aenean ante orci, porttitor quis blandit ac, accumsan molestie ante. Sed a aliquet est, laoreet ornare ante. Fusce gravida, mi at ultricies aliquam, nisl magna faucibus magna, quis tincidunt erat diam eu nulla. Suspendisse potenti. Nunc risus nulla, venenatis nec lorem a, porta eleifend massa. Fusce interdum risus vel consequat bibendum. Cras vel tellus quis purus tempor auctor. Ut ac gravida felis, vel mollis velit. In hendrerit at ex ut imperdiet. Donec erat nisi, tempor et cursus id, cursus quis enim. Curabitur iaculis quis urna non efficitur. Quisque tempor dictum turpis bibendum bibendum. Nullam eget ligula odio. Integer ullamcorper vel tellus et gravida. Nam in bibendum ligula, et consectetur metus. Praesent feugiat dapibus eleifend. Nam in est nunc. Nullam rutrum justo nec enim mattis, eget gravida eros facilisis. Pellentesque interdum sapien at lectus mollis malesuada. Aliquam erat volutpat. Aenean quis nisl nisi. Nulla mollis magna aliquam sem feugiat, ut vestibulum leo fermentum. Aenean gravida non augue varius consectetur. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas convallis erat vel diam dapibus mollis. Cras pharetra luctus dignissim. Nullam vehicula erat quis congue venenatis. Aliquam elementum sit amet lectus non semper. Ut at neque in nibh scelerisque ultrices. Suspendisse potenti. Etiam tincidunt suscipit pellentesque. Nunc at blandit lectus. Nunc magna mauris, sollicitudin vitae ex vitae morbi.`;

module.exports = {
  instance,
  userOne,
  userTwo,
  userThree,
  nonExistentUser,
  longComment
};
