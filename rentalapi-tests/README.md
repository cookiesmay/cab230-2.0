# QUT CAB230 Assignment 3 Tests

## Here we provide the test suite that will be used in assessing your server.

To run the tests, first install the dependencies, make sure that your server is running and then run the test command as shown:

```bash
npm install
npm test
```

By default we test `http://localhost:3000`, however you may change the URL setting to suit your system by editing the definition in the file `api.js`:

```javascript
//If you are serving your server on any port other than 3000, change the port here, or alternatively change the url to approriate
//If you are using https, change the protocol from 'http' to 'https'
const REMOTE_API_URL = `http://localhost:3000`;
```

After you enable HTTPS, you will need to edit this and change http to https.

## After each run

After each run, you will see output on the screen, but if there are a number of errors you will find it easier to browse the `report.html` file which will appear in the top directory. This will give you a good idea of how your server is behaving. Ideally you'd want to see all tests passing. If you aren't sure what is going wrong, have a look at the messages and then dig directly into the code itself - the files ending in `.test.js`. If you are unsure of the behaviour, look at the Swagger or hit the endpoint with Insomnia to debug.

## Some more detail

If you look through the code itself (`integration.test.js`) you will notice that there are different types of tests. For some of them, we are happy just to confirm that:

- The status code is correct
- The `error` key is present and correct
- The returned object has a `message` key

Here is an example of that sort of test code:

```javascript
test("should return status code 404", () => expect(response.status).toBe(404));
test("should return error with boolean value true", () =>
  expect(response.data.error).toBe(true));
test("should contain message property", () =>
  expect(response.data).toHaveProperty("message"));
```

In other cases, you will want to verify that the actual results are correct:

```javascript
    test("should contain correct title property", () =>
      expect(response.data.title).toBe("Great location, large family home"));
    test("should contain correct rent property", () =>
      expect(response.data.rent).toBe(870));
    test("should contain correct propertyType property", () =>
      expect(response.data.runtime).toBe("house"));
```

and so on. The giveaway is the `expect().toBe()` which makes it clear that we have a specific value in mind. The tests are your friend.

## Will they change?

We will not introduce other test conditions. We reserve the right to change the data. So, for example, we might check a different rental property, just to make sure that you haven't hardcoded responses to our tests.

If you hardcode your responses, we will find out and we won't be impressed. If you can pass these tests legitimately, then you will be fine.
