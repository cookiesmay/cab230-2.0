const to = require("./lib/to");
const {
  instance,
  userOne,
  userTwo,
  nonExistentUser,
  userThree,
  longComment,
} = require("./lib/setup");
const { v4: uuid } = require("uuid");
const COMMENT = "This is a comment";
const COMMENT2 = "This is a new comment";

jest.setTimeout(20000);

/* ======================= States ======================= */
describe("states", () => {
  describe("with no query params", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/states`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Array));

    test("should have 8 entries", () =>
      expect(response.data.length).toBe(8));

    test("first should be ACT", () =>
      expect(response.data[0]).toBe("ACT"));
  });
  describe("with invalid query param", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/states?abcd=efgh`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should return error with boolean value true", () =>
      expect(response.data.error).toBe(true));

    test("message property should contain invalid param", () =>
      expect(response.data.message).toContain("Invalid query parameters: abcd"));
  });
});

/* =================== Property Types =================== */
describe("property-types", () => {
  describe("with no query params", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/property-types`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Array));

    test("should have 11 entries", () =>
      expect(response.data.length).toBe(11));

    test("first should be acreage/semi-rural", () =>
      expect(response.data[0]).toBe("acreage/semi-rural"));
  });
  describe("with invalid query param", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/property-types?ijkl=mnop`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should return error with boolean value true", () =>
      expect(response.data.error).toBe(true));

    test("message property should contain invalid param", () =>
      expect(response.data.message).toContain("Invalid query parameters: ijkl"));
  });
});

/* ======================= Search ======================= */
describe("search", () => {
  describe("with no query params", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(1));
    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toBe("Auburn Townhouse For Lease"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(1200));
    test("should contain correct propertyType property", () =>
      expect(response.data.data[0].propertyType).toBe("townhouse"));
    test("should contain correct latitude property", () =>
      expect(response.data.data[0].latitude).toBeCloseTo(-33.84077015, 5));
    test("should contain correct longitude property", () =>
      expect(response.data.data[0].longitude).toBeCloseTo(151.00802461, 5));
    test("should contain correct postcode property", () =>
      expect(response.data.data[0].postcode).toBe(2144));
    test("should contain correct state property", () =>
      expect(response.data.data[0].state).toBe("NSW"));
    test("should contain correct suburb property", () =>
      expect(response.data.data[0].suburb).toBe("Auburn"));
    test("should contain correct bathrooms property", () =>
      expect(response.data.data[0].bathrooms).toBe(2));
    test("should contain correct bedrooms property", () =>
      expect(response.data.data[0].bedrooms).toBe(4));
    test("should contain correct parkingSpaces property", () =>
      expect(response.data.data[0].parkingSpaces).toBe(2));

    test("should contain averageRating property", () =>
      expect(response.data.data[0]).toHaveProperty("averageRating"));
    test("should contain numRatings property", () =>
      expect(response.data.data[0]).toHaveProperty("numRatings"));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(6767));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(677));
    test("should contain correct prevPage property", () =>
      expect(response.data.pagination.prevPage).toBe(null));
    test("should contain correct nextPage property", () =>
      expect(response.data.pagination.nextPage).toBe(2));
    test("should contain correct perPage property", () =>
      expect(response.data.pagination.perPage).toBe(10));
    test("should contain correct currentPage property", () =>
      expect(response.data.pagination.currentPage).toBe(1));
    test("should contain correct from property", () =>
      expect(response.data.pagination.from).toBe(0));
    test("should contain correct to property", () =>
      expect(response.data.pagination.to).toBe(10));
  });

  describe("with suburb (Darlinghurst) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?suburb=Darlinghurst`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(3));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(2));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(420));
    test("should contain correct bathrooms property", () =>
      expect(response.data.data[0].bathrooms).toBe(1));
    test("should contain correct bedrooms property", () =>
      expect(response.data.data[0].bedrooms).toBe(3));
    test("should contain correct parkingSpaces property", () =>
      expect(response.data.data[0].parkingSpaces).toBe(2));

    test("should contain averageRating property", () =>
      expect(response.data.data[0]).toHaveProperty("averageRating"));
    test("should contain numRatings property", () =>
      expect(response.data.data[0]).toHaveProperty("numRatings"));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(3));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(1));

    test("should contain correct prevPage property", () =>
      expect(response.data.pagination.prevPage).toBe(null));
    test("should contain correct nextPage property", () =>
      expect(response.data.pagination.nextPage).toBe(null));

    test("should contain correct perPage property", () =>
      expect(response.data.pagination.perPage).toBe(10));
    test("should contain correct currentPage property", () =>
      expect(response.data.pagination.currentPage).toBe(1));
    test("should contain correct from property", () =>
      expect(response.data.pagination.from).toBe(0));
    test("should contain correct to property", () =>
      expect(response.data.pagination.to).toBe(3));
  });

  describe("with suburb (asdfghjkl) query param - no results within dataset", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?suburb=asdfghjkl`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(0));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(0));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(0));

    test("should contain correct prevPage property", () =>
      expect(response.data.pagination.prevPage).toBe(null));
    test("should contain correct nextPage property", () =>
      expect(response.data.pagination.nextPage).toBe(null));

    test("should contain correct perPage property", () =>
      expect(response.data.pagination.perPage).toBe(10));
    test("should contain correct currentPage property", () =>
      expect(response.data.pagination.currentPage).toBe(1));
    test("should contain correct from property", () =>
      expect(response.data.pagination.from).toBe(0));
    test("should contain correct to property", () =>
      expect(response.data.pagination.to).toBe(0));
  });

  describe("with state (Qld) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?state=Qld`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(3));
    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toContain("A PLACE TO TRULY CALL HOME"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(580));
    test("should contain correct propertyType property", () =>
      expect(response.data.data[0].propertyType).toBe("house"));
    test("should contain correct latitude property", () =>
      expect(response.data.data[0].latitude).toBeCloseTo(-22.00005312, 5));
    test("should contain correct longitude property", () =>
      expect(response.data.data[0].longitude).toBeCloseTo(148.06354374, 5));

    test("should contain averageRating property", () =>
      expect(response.data.data[0]).toHaveProperty("averageRating"));
    test("should contain numRatings property", () =>
      expect(response.data.data[0]).toHaveProperty("numRatings"));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(852));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(86));
  });

  describe("with postcode (4000) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?postcode=4000`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(7));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(167));

    // pagination
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(7));
  });

  describe("with invalid postcode (90210) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?postcode=90210`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid postcode parameter. Must be an integer in the range of 0000-9999."));
  });

  describe("with minimumRent (1000) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?minimumRent=1000`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(756));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(76));

    test("should contain correct prevPage property", () =>
      expect(response.data.pagination.prevPage).toBe(null));
    test("should contain correct nextPage property", () =>
      expect(response.data.pagination.nextPage).toBe(2));

    test("should contain correct perPage property", () =>
      expect(response.data.pagination.perPage).toBe(10));
    test("should contain correct currentPage property", () =>
      expect(response.data.pagination.currentPage).toBe(1));
    test("should contain correct from property", () =>
      expect(response.data.pagination.from).toBe(0));
    test("should contain correct to property", () =>
      expect(response.data.pagination.to).toBe(10));
  });

  describe("with invalid minimumRent (asdfghjk) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?minimumRent=asdfghjk`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid minimumRent parameter. Must be a non-negative integer."));
  });

  describe("with maximumRent (500) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?maximumRent=500`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(1160));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(116));

  });

  describe("with invalid maximumRent (hjkl) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?maximumRent=hjkl`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid maximumRent parameter. Must be a non-negative integer."));
  });

  describe("with minimumBathrooms (4) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?minimumBathrooms=4`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(62));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(7));
  });

  describe("with invalid minimumBathrooms (-6) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?minimumBathrooms=-6`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid minimumBathrooms parameter. Must be a non-negative integer."));
  });

  describe("with maximumBathrooms (1) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?maximumBathrooms=1`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(3413));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(342));
  });

  describe("with invalid maximumBathrooms (three) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?maximumBathrooms=three`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid maximumBathrooms parameter. Must be a non-negative integer."));
  });

  describe("with minimumBedrooms (5) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?minimumBedrooms=5`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(294));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(30));
  });

  describe("with invalid minimumBedrooms (-2) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?minimumBedrooms=-2`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid minimumBedrooms parameter. Must be a non-negative integer."));
  });

  describe("with maximumBedrooms (2) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?maximumBedrooms=2`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(2661));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(267));
  });

  describe("with invalid maximumBedrooms (-10) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?maximumBedrooms=-10`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid maximumBedrooms parameter. Must be a non-negative integer."));
  });

  describe("with minimumParking (3) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?minimumParking=3`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(586));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(59));
  });

  describe("with invalid minimumParking (hello) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?minimumParking=hello`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid minimumParking parameter. Must be a non-negative integer."));
  });

  describe("with maximumParking (1) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?maximumParking=1`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(2887));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(289));
  });

  describe("with invalid maximumParking (-1) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?maximumParking=-1`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid maximumParking parameter. Must be a non-negative integer."));
  });

  describe("with propertyTypes (duplex/semi-detached) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?propertyTypes=duplex%2Fsemi-detached`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(4));
    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toBe("It will go quick! Call us now"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(375));
  });

  describe("with multiple propertyTypes (apartment, flat, unit) query param", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?propertyTypes=apartment&propertyTypes=flat&propertyTypes=unit`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(5));
    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toBe("Stylish Waterside Living"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(630));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(2215));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(222));
  });

  describe("with invalid page (0) query param", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?page=0`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data.message).toBe(
        "Invalid page parameter. Must be an integer greater than or equal to 1."
      ));
  });

  describe("with page (66) query params", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?page=66`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toBe("Large 3 bedroom Townhouse"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(640));
    test("should contain correct propertyType property", () =>
      expect(response.data.data[0].propertyType).toBe("house"));

    test("should contain correct state property", () =>
      expect(response.data.data[0].state).toBe("Qld"));
    test("should contain correct suburb property", () =>
      expect(response.data.data[0].suburb).toBe("Bethania"));
    test("should contain correct bathrooms property", () =>
      expect(response.data.data[0].bathrooms).toBe(2));
    test("should contain correct bedrooms property", () =>
      expect(response.data.data[0].bedrooms).toBe(3));
    test("should contain correct parkingSpaces property", () =>
      expect(response.data.data[0].parkingSpaces).toBe(2));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(6767));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(677));

    test("should contain correct prevPage property", () =>
      expect(response.data.pagination.prevPage).toBe(65));
    test("should contain correct nextPage property", () =>
      expect(response.data.pagination.nextPage).toBe(67));

    test("should contain correct perPage property", () =>
      expect(response.data.pagination.perPage).toBe(10));
    test("should contain correct currentPage property", () =>
      expect(response.data.pagination.currentPage).toBe(66));
    test("should contain correct from property", () =>
      expect(response.data.pagination.from).toBe(650));
    test("should contain correct to property", () =>
      expect(response.data.pagination.to).toBe(660));
  });

  describe("with page out of bounds", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?page=700`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(0));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(6767));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(677));

    test("should contain correct prevPage property", () =>
      expect(response.data.pagination.prevPage).toBe(699));
    test("should contain correct nextPage property", () =>
      expect(response.data.pagination.nextPage).toBe(null));

    test("should contain correct perPage property", () =>
      expect(response.data.pagination.perPage).toBe(10));
    test("should contain correct currentPage property", () =>
      expect(response.data.pagination.currentPage).toBe(700));
    test("should contain correct from property", () =>
      expect(response.data.pagination.from).toBe(6990));
    test("should contain correct to property", () =>
      expect(response.data.pagination.to).toBe(6990));
  });

  describe("with state, minimumBedrooms and maximumRent query params", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/search?state=Qld&minimumBedrooms=3&maximumRent=500`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toBe("Modern Duplex Living in Sought-After Hospital Hill"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(500));
    test("should contain correct propertyType property", () =>
      expect(response.data.data[0].propertyType).toBe("unit"));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(42));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(5));

  });

  describe("sorting by rent", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?sortBy=rent`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(6752));
    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toBe("20 ACRES OF LAND IN GREAT LOCATION"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(100));

    test("should contain averageRating property", () =>
      expect(response.data.data[0]).toHaveProperty("averageRating"));
    test("should contain numRatings property", () =>
      expect(response.data.data[0]).toHaveProperty("numRatings"));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(6767));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(677));
  });

  describe("sorting by bathrooms, sortOrder desc", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?sortBy=bathrooms&sortOrder=desc`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(6760));
    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toBe("Your gateway to modern duplex living!"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(3800));

    test("should contain averageRating property", () =>
      expect(response.data.data[0]).toHaveProperty("averageRating"));
    test("should contain numRatings property", () =>
      expect(response.data.data[0]).toHaveProperty("numRatings"));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(6767));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(677));
  });

  describe("sorting by suburb, sortOrder asc", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?sortBy=suburb&sortOrder=asc`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct suburb property", () =>
      expect(response.data.data[0].suburb).toBe("Abbotsford"));
  });

  describe("with invalid sortBy (termites) query param", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?sortBy=termites`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data.message).toBe(
        "Invalid sortBy parameter. Must refer to a valid sortable property."
      ));
  });

  describe("sorting by postcode, with invalid sortOrder (reverse) query param", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?sortBy=postcode&sortOrder=reverse`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data.message).toBe(
        "Invalid sortOrder parameter. Must be 'asc' or 'desc'."
      ));
  });

  describe("with sortOrder query param, but no sortBy", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?sortOrder=desc`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data.message).toBe(
        "Invalid sortOrder parameter. sortBy must be specified."
      ));
  });

  describe("find the northernmost townhouse in Qld", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search?state=Qld&propertyTypes=townhouse&sortBy=latitude&sortOrder=desc`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    // rentals
    test("should contain correct data property", () =>
      expect(response.data.data).toBeInstanceOf(Array));
    test("should contain correct number of rentals", () =>
      expect(response.data.data.length).toBe(10));

    test("should contain correct id property", () =>
      expect(response.data.data[0].id).toBe(47));
    test("should contain correct title property", () =>
      expect(response.data.data[0].title).toBe("Available March | An Exclusive Address | Edge Hill Living"));
    test("should contain correct rent property", () =>
      expect(response.data.data[0].rent).toBe(850));
    test("should contain correct propertyType property", () =>
      expect(response.data.data[0].propertyType).toBe("townhouse"));
    test("should contain correct latitude property", () =>
      expect(response.data.data[0].latitude).toBeCloseTo(-16.90120347, 5));
    test("should contain correct longitude property", () =>
      expect(response.data.data[0].longitude).toBeCloseTo(145.73830228, 5));
    test("should contain correct postcode property", () =>
      expect(response.data.data[0].postcode).toBe(4870));
    test("should contain correct state property", () =>
      expect(response.data.data[0].state).toBe("Qld"));
    test("should contain correct suburb property", () =>
      expect(response.data.data[0].suburb).toBe("Edge Hill"));
    test("should contain correct bathrooms property", () =>
      expect(response.data.data[0].bathrooms).toBe(2));
    test("should contain correct bedrooms property", () =>
      expect(response.data.data[0].bedrooms).toBe(3));
    test("should contain correct parkingSpaces property", () =>
      expect(response.data.data[0].parkingSpaces).toBe(1));

    test("should contain averageRating property", () =>
      expect(response.data.data[0]).toHaveProperty("averageRating"));
    test("should contain numRatings property", () =>
      expect(response.data.data[0]).toHaveProperty("numRatings"));

    // pagination
    test("should contain correct pagination property", () =>
      expect(response.data.pagination).toBeInstanceOf(Object));
    test("should contain correct total property", () =>
      expect(response.data.pagination.total).toBe(38));
    test("should contain correct lastPage property", () =>
      expect(response.data.pagination.lastPage).toBe(4));
  });

});

/* ================== Individual Rental ================== */
describe("rental", () => {
  describe("with invalid query params", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`rentals/1?aQueryParam=test`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should contain message property", () =>
      expect(response.data.message).toContain(
        "Invalid query parameters: aQueryParam"
      ));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with rental that does not exist (99999) in data set", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/99999`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 404", () =>
      expect(response.status).toBe(404));

    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with rental that does exist (1234)", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/1234`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct title property", () =>
      expect(response.data.title).toBe("Fabulous Position with Courtyard!"));
    test("should contain correct rent property", () =>
      expect(response.data.rent).toBe(490));
    test("should contain correct description property", () =>
      expect(response.data.description).toContain("Fabulously positioned one block from Williamstown Beach"));

    test("should contain correct propertyType property", () =>
      expect(response.data.propertyType).toBe("apartment"));
    test("should contain correct locality property", () =>
      expect(response.data.locality).toBe("Williamstown"));
    test("should contain correct latitude property", () =>
      expect(response.data.latitude).toBeCloseTo(-37.865889, 4));
    test("should contain correct longitude property", () =>
      expect(response.data.longitude).toBeCloseTo(144.891426, 4));
    test("should contain correct postcode property", () =>
      expect(response.data.postcode).toBe(3016));
    test("should contain correct state property", () =>
      expect(response.data.state).toBe("Vic"));
    test("should contain correct streetAddress property", () =>
      expect(response.data.streetAddress).toBe("4/4 Gellibrand Street"));
    test("should contain correct suburb property", () =>
      expect(response.data.suburb).toBe("Williamstown"));
    test("should contain correct bathrooms property", () =>
      expect(response.data.bathrooms).toBe(1));
    test("should contain correct bedrooms property", () =>
      expect(response.data.bedrooms).toBe(2));
    test("should contain correct parkingSpaces property", () =>
      expect(response.data.parkingSpaces).toBe(1));

    test("should contain correct agencyName property", () =>
      expect(response.data.agencyName).toBe("Compton Green - Inner West"));
    test("should contain correct amenities property", () =>
      expect(response.data.amenities).toBe("Balcony, Carport: 1, Courtyard, Built-in Wardrobes, Toilets: 1"));
  });
});

/* ============== User Registration & Login ============== */
let profileUserOneBearerToken;
let profileUserTwoBearerToken;
let shortExpiryBearerToken;

describe("registration", () => {
  describe("with missing email", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/register`, {
          password: userOne.password,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with missing password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/register`, {
          email: userOne.email,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with missing email and password", () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`user/register`, {}));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with valid email and password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/register`, {
          email: userOne.email,
          password: userOne.password,
        })
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 201", () =>
      expect(response.status).toBe(201));

    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });
});

describe("login", () => {
  describe("with missing email", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, {
          password: userOne.password,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with missing password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, { email: userOne.email })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));

    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with non-existing user (email)", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, {
          email: nonExistentUser.email,
          password: nonExistentUser.password,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));

    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with invalid password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, {
          email: userOne.email,
          password: "invalid-password",
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));

    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with valid email and password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, {
          email: userOne.email,
          password: userOne.password,
        })
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
    expect(response.status).toBe(200));

    test("should contain token property", () =>
      expect(response.data).toHaveProperty("token"));
    test("should contain tokenType property", () =>
      expect(response.data).toHaveProperty("tokenType"));
    test("should contain expiresIn property", () =>
      expect(response.data).toHaveProperty("expiresIn"));
    test("should contain correct tokenType", () =>
      expect(response.data.tokenType).toBe(`Bearer`));
    test("should contain correct expiresIn", () =>
      expect(response.data.expiresIn).toBe(86400));
  });

  describe("debug login", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/debugLogin`, {
          email: userOne.email,
          password: userOne.password,
        })
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
    expect(response.status).toBe(200));

    test("should contain token property", () => {
      expect(response.data).toHaveProperty("token");
      shortExpiryBearerToken = response.data.token;
    });

    test("should contain tokenType property", () =>
      expect(response.data).toHaveProperty("tokenType"));
    test("should contain expiresIn property", () =>
      expect(response.data).toHaveProperty("expiresIn"));
    test("should contain correct tokenType", () =>
      expect(response.data.tokenType).toBe(`Bearer`));
    test("should contain correct expiresIn", () =>
      expect(response.data.expiresIn).toBe(1));
  });
});

/* ======================= Profile ======================= */

describe("profile", () => {
  beforeAll(async () => {
    const request = await to.object(
      instance.post(`user/register`, {
        email: userTwo.email,
        password: userTwo.password,
      })
    );

    const userOnelogin = await instance.post(`user/login`, {
      email: userOne.email,
      password: userOne.password,
    });
    profileUserOneBearerToken = userOnelogin.data.token;

    const login = await instance.post(`user/login`, {
      email: userTwo.email,
      password: userTwo.password,
    });
    profileUserTwoBearerToken = login.data.token;
  });

  describe("retrieval with default profile values", () => {
    describe("with unauthenticated request for non existent user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${uuid()}@email.com/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 404", () =>
        expect(response.status).toBe(404));

      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
    });

    describe("with authenticated request for non existent user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${uuid()}@email.com/profile`, {
            headers: { Authorization: `Bearer ${profileUserOneBearerToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 404", () =>
        expect(response.status).toBe(404));

      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
    });

    describe("with unauthenticated user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));

      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });

    describe("with authenticated matching user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`, {
            headers: { Authorization: `Bearer ${profileUserOneBearerToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));

      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should return null for unset dob", () =>
        expect(response.data.dob).toBe(null));
      test("should return null for unset address", () =>
        expect(response.data.address).toBe(null));
    });

    describe("with authenticated non-matching user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`, {
            headers: { Authorization: `Bearer ${profileUserTwoBearerToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));

      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });
  });

  describe("update of user profile", () => {
    describe("with unauthenticated user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.put(`user/${userOne.email}/profile`, {
            firstName: userOne.firstName,
            lastName: userOne.lastName,
            address: userOne.address,
            dob: userOne.dob,
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 401", () =>
        expect(response.status).toBe(401));

      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with authenticated non-matching user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.put(
            `user/${userOne.email}/profile`,
            {
              firstName: userOne.firstName,
              lastName: userOne.lastName,
              address: userOne.address,
              dob: userOne.dob,
            },
            {
              headers: { Authorization: `Bearer ${profileUserTwoBearerToken}` },
            }
          )
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 403", () =>
        expect(response.status).toBe(403));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with authenticated matching user", () => {
      describe("with missing body keys", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return specific message for 'Request body incomplete: firstName, lastName, dob and address are required.'", () =>
          expect(response.data.message).toBe(
            "Request body incomplete: firstName, lastName, dob and address are required."
          ));
      });

      describe("with invalid firstName", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: 123,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: userOne.dob,
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));

        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid: firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid: firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid lastName", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: 987,
                address: userOne.address,
                dob: userOne.dob,
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));

        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid: firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid: firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid address", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: true,
                dob: userOne.dob,
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));

        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid: firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid: firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid date format", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: new Date().toISOString(),
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));

        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (out of bounds check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: "2021-13-32",
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));

        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (JavaScript date rollover check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: "2021-04-31",
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));

        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (non leap-year check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: "2021-02-29",
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));

        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
      });

      describe("with valid date in the future", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: "2031-05-31",
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));

        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input, dob must be a date in the past.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a date in the past."
          ));
      });

      describe("with valid date in the past", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: userOne.dob,
              },
              {
                headers: {
                  Authorization: `Bearer ${profileUserOneBearerToken}`,
                },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 200", () =>
          expect(response.status).toBe(200));
        test("should be an object result", () =>
          expect(response.data).toBeInstanceOf(Object));
        test("should return user email property", () =>
          expect(response.data.email).toBe(userOne.email));
        test("should return updated firstName", () =>
          expect(response.data.firstName).toBe(userOne.firstName));
        test("should return updated lastName", () =>
          expect(response.data.lastName).toBe(userOne.lastName));
        test("should return updated dob", () =>
          expect(response.data.dob).toBe(userOne.dob));
        test("should return updated address", () =>
          expect(response.data.address).toBe(userOne.address));
      });
    });
  });

  describe("retrieval after update of user profile", () => {
    describe("with unauthenticated user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));

      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(userOne.firstName));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(userOne.lastName));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });

    describe("with authenticated matching user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`, {
            headers: { Authorization: `Bearer ${profileUserOneBearerToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));

      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(userOne.firstName));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(userOne.lastName));
      test("should return updated dob", () =>
        expect(response.data.dob).toBe(userOne.dob));
      test("should return updated address", () =>
        expect(response.data.address).toBe(userOne.address));
    });

    describe("with authenticated non-matching user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`, {
            headers: { Authorization: `Bearer ${profileUserTwoBearerToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));

      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(userOne.firstName));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(userOne.lastName));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });
  });
});

/* ======================= Ratings ======================= */

describe("ratings", () => {
  describe("debug erase ratings", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/debugEraseRatings`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });
  describe("rentals search without ratings", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain null averageRating property", () =>
      expect(response.data.data[0].averageRating).toBe(null));
    test("should contain correct numRatings property", () =>
      expect(response.data.data[0].numRatings).toBe(0));
  });
  describe("rental without ratings", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/2345`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
    test("should contain null averageRating property", () =>
      expect(response.data.averageRating).toBe(null));
    test("should contain correct numRatings property", () =>
      expect(response.data.numRatings).toBe(0));
    test("should contain reviews array", () =>
      expect(response.data.reviews).toBeInstanceOf(Array));
    test("reviews array should be empty", () =>
      expect(response.data.reviews.length).toBe(0));
  });
  describe("get non-existent rating without authorisation", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/123`)
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Authorization header ('Bearer token') not found"));
  });
  describe("get non-existent rating with authorisation", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`ratings/rentals/123`, {
          headers: { Authorization: `Bearer ${profileUserOneBearerToken}` },
        })
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 404", () =>
      expect(response.status).toBe(404));
    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("No rating exists with this rental ID."));
  });
  describe("rate non-existent rental", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/90000`, {
          rating: 5
        }, { headers: { Authorization: `Bearer ${profileUserOneBearerToken}` } })
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 404", () =>
      expect(response.status).toBe(404));
    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("No rental exists with this ID."));
  });
  describe("rate without authorisation", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/1234`, {
          rating: 5
        })
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Authorization header ('Bearer token') not found"));
  });
  describe("rate with invalid token", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/1234`, {
          rating: 5
        }, {headers: { Authorization: `Bearer blah` }})
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid JWT token"));
  });
  describe("rate with expired token", () => {
    beforeAll(async () => {
      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      const request = await to.object(
        instance.post(`ratings/rentals/1234`, {
          rating: 5
        }, {headers: { Authorization: `Bearer ${shortExpiryBearerToken}` }})
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("JWT token has expired"));
  });
  describe("rate without comment", () => {
    const requestTime = Date.now();

    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/3`, {
          rating: 4
        }, {headers: { Authorization: `Bearer ${profileUserOneBearerToken}` }})
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 201", () =>
      expect(response.status).toBe(201));
    test("should contain correct rating property", () =>
      expect(response.data.rating).toBe(4));
    test("should not contain comment property", () =>
      expect(response.data.rating).not.toHaveProperty("comment"));

    test("should contain dateTime property", () =>
      expect(response.data).toHaveProperty("dateTime"));

    // 1 minute of leeway either side

    test("should contain correct dateTime", () => {
      const responseTime = new Date(response.data.dateTime).getTime();
      expect(responseTime).toBeGreaterThanOrEqual(requestTime - 60000);
      expect(responseTime).toBeLessThanOrEqual(requestTime + 60000);
    });
  });
  describe("rate with comment that's too long", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/27`, {
          rating: 2,
          comment: longComment
        }, {headers: { Authorization: `Bearer ${profileUserOneBearerToken}` }})
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 40", () =>
      expect(response.status).toBe(400));
    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid comment parameter. Comment must be a string 1-2000 characters long."));
  });
  describe("rate with empty comment", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/456`, {
          rating: 2,
          comment: ""
        }, {headers: { Authorization: `Bearer ${profileUserOneBearerToken}` }})
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 40", () =>
      expect(response.status).toBe(400));
    test("should contain correct error property", () =>
      expect(response.data.error).toBe(true));
    test("should contain correct message property", () =>
      expect(response.data.message).toBe("Invalid comment parameter. Comment must be a string 1-2000 characters long."));
  });
  describe("rate with comment", () => {
    const requestTime = Date.now();
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/3`, {
          rating: 3,
          comment: COMMENT
        }, {headers: { Authorization: `Bearer ${profileUserTwoBearerToken}` }})
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 201", () =>
      expect(response.status).toBe(201));
    test("should contain correct rating property", () =>
      expect(response.data.rating).toBe(3));
    test("should contain correct comment property", () =>
      expect(response.data.comment).toBe(COMMENT));

    test("should contain dateTime property", () =>
      expect(response.data).toHaveProperty("dateTime"));

    // 1 minute of leeway either side
    test("should contain correct dateTime", () => {
      const responseTime = new Date(response.data.dateTime).getTime();
      expect(responseTime).toBeGreaterThanOrEqual(requestTime - 60000);
      expect(responseTime).toBeLessThanOrEqual(requestTime + 60000);
    });
  });
  describe("rentals search with ratings", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/search`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
    test("should contain averageRating 3.5 property", () =>
      expect(response.data.data[2].averageRating).toBeCloseTo(3.5, 5));
    test("should contain correct numRatings property", () =>
      expect(response.data.data[2].numRatings).toBe(2));
  });
  describe("rental with ratings", () => {
    const requestTime = Date.now();
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/3`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct averageRating property", () =>
      expect(response.data.averageRating).toBeCloseTo(3.5, 5));
    test("should contain correct numRatings property", () =>
      expect(response.data.numRatings).toBe(2));
    test("should contain reviews array", () =>
      expect(response.data.reviews).toBeInstanceOf(Array));
    test("reviews array should be correct size", () =>
      expect(response.data.reviews.length).toBe(2));
    test("should contain non-comment review with correct rating property", () =>
      expect(response.data.reviews[0].rating).toBe(4));
    test("should contain comment review with correct rating property", () =>
      expect(response.data.reviews[1].rating).toBe(3));
    test("should contain non-comment review with correct user property", () =>
      expect(response.data.reviews[0].user).toBe(userOne.email));
    test("should contain comment review with correct user property", () =>
      expect(response.data.reviews[1].user).toBe(userTwo.email));
    test("should contain non-comment review without comment property", () =>
      expect(response.data.reviews[0]).not.toHaveProperty("comment"));
    test("should contain comment review with correct comment property", () =>
      expect(response.data.reviews[1].comment).toBe(COMMENT));

    // 1 minute of leeway either side
    test("should contain non-comment review with correct dateTime property", () => {
      const nonCommentResponseTime = new Date(response.data.reviews[0].dateTime).getTime();
      expect(nonCommentResponseTime).toBeGreaterThanOrEqual(requestTime - 60000);
      expect(nonCommentResponseTime).toBeLessThanOrEqual(requestTime + 60000);
    });
    test("should contain comment review with correct dateTime property", () => {
      const commentResponseTime = new Date(response.data.reviews[1].dateTime).getTime();
      expect(commentResponseTime).toBeGreaterThanOrEqual(requestTime - 60000);
      expect(commentResponseTime).toBeLessThanOrEqual(requestTime + 60000);
    });
  });
  describe("update existing rating", () => {
    const requestTime = Date.now();
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`ratings/rentals/3`, {
          rating: 5,
          comment: COMMENT2
        }, {headers: { Authorization: `Bearer ${profileUserTwoBearerToken}` }})
      );

      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 201", () =>
      expect(response.status).toBe(201));
    test("should contain correct rating property", () =>
      expect(response.data.rating).toBe(5));
    test("should contain correct comment property", () =>
      expect(response.data.comment).toBe(COMMENT2));

    test("should contain dateTime property", () =>
      expect(response.data).toHaveProperty("dateTime"));

    // 1 minute of leeway either side
    test("should contain correct dateTime", () => {
      const responseTime = new Date(response.data.dateTime).getTime();
      expect(responseTime).toBeGreaterThanOrEqual(requestTime - 60000);
      expect(responseTime).toBeLessThanOrEqual(requestTime + 60000);
    });
  });
  describe("rental with ratings after update", () => {
    const requestTime = Date.now();
    beforeAll(async () => {
      const request = await to.object(instance.get(`rentals/3`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));

    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct averageRating property", () =>
      expect(response.data.averageRating).toBeCloseTo(4.5, 5));
    test("should contain correct numRatings property", () =>
      expect(response.data.numRatings).toBe(2));
    test("should contain reviews array", () =>
      expect(response.data.reviews).toBeInstanceOf(Array));
    test("reviews array should be correct size", () =>
      expect(response.data.reviews.length).toBe(2));
    test("should contain non-comment review with correct rating property", () =>
      expect(response.data.reviews[0].rating).toBe(4));
    test("should contain comment review with correct rating property", () =>
      expect(response.data.reviews[1].rating).toBe(5));
    test("should contain non-comment review with correct user property", () =>
      expect(response.data.reviews[0].user).toBe(userOne.email));
    test("should contain comment review with correct user property", () =>
      expect(response.data.reviews[1].user).toBe(userTwo.email));
    test("should contain non-comment review without comment property", () =>
      expect(response.data.reviews[0]).not.toHaveProperty("comment"));
    test("should contain comment review with correct comment property", () =>
      expect(response.data.reviews[1].comment).toBe(COMMENT2));

    // 1 minute of leeway either side
    test("should contain non-comment review with correct dateTime property", () => {
      const nonCommentResponseTime = new Date(response.data.reviews[0].dateTime).getTime();
      expect(nonCommentResponseTime).toBeGreaterThanOrEqual(requestTime - 60000);
      expect(nonCommentResponseTime).toBeLessThanOrEqual(requestTime + 60000);
    });
    test("should contain comment review with correct dateTime property", () => {
      const commentResponseTime = new Date(response.data.reviews[1].dateTime).getTime();
      expect(commentResponseTime).toBeGreaterThanOrEqual(requestTime - 60000);
      expect(commentResponseTime).toBeLessThanOrEqual(requestTime + 60000);
    });
  });
});

/* ======================= Misc ======================= */

describe("miscellaneous", () => {
  describe("with non-existent route", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${uuid()}`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 404", () => expect(response.status).toBe(404));
  });

  describe("with swagger docs route", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`docs`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 200", () => expect(response.status).toBe(200));

    test("should return Swagger UI", () =>
      expect(response.data).toContain("Swagger UI"));
  });
});
