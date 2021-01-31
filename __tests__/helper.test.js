const helper = require("../app/utils/helpers");

describe("Helper Functions Test Cases", () => {
  [
    {
      fnName: "isObject",
      fnParams: {},
      expectResult: true,
    },
    {
      fnName: "isValidArray",
      fnParams: [1, 2, 3],
      expectResult: true,
    },
    {
      fnName: "isValidObject",
      fnParams: { name: "test" },
      expectResult: true,
    },
    {
      fnName: "isObject",
      fnParams: null,
      expectResult: false,
    },
    {
      fnName: "isValidArray",
      fnParams: [],
      expectResult: false,
    },
    {
      fnName: "isValidObject",
      fnParams: {},
      expectResult: false,
    },
  ].map(({ fnName, fnParams, expectResult }) => {
    it(`Testing -> ${fnName}`, async (done) => {
      const result = helper[fnName](fnParams);
      expect(result ? true : false).toBe(expectResult);
      done();
    });
  });
});
