var assert = require('assert');

var coyl = require('../src/coyl.js');

describe("coyl", () => {
  describe("pseudo-random number generator", () => {
    it("can set the random seed", () => {
      let seed = 123;
      coyl.setSeed(seed);

      assert.equal(coyl.getSeed(), seed)
    });

    it("updates the seed after generating a random number", () => {
      let seed = 123;
      coyl.setSeed(seed);
      coyl.random();

      result = coyl.getSeed();
      assert.notEqual(result, seed);
    });

    it("generates the same pseudo-random number from the same seed", () => {
      let seed = 123;

      coyl.setSeed(seed);
      firstResult = coyl.random();

      coyl.setSeed(seed);
      secondResult = coyl.random();

      assert.equal(firstResult, secondResult);
    });
  });

  describe("isObject", () => {
    it("counts objects as objects", () => {
      result = coyl.isObject({ hello: true });

      assert.equal(result, true);
    });

    it("counts empty objects as objects", () => {
      result = coyl.isObject({});

      assert.equal(result, true);
    });

    it("does not count arrays as objects", () => {
      result = coyl.isObject([]);

      assert.equal(result, false);
    });

    it("does not count functions as objects", () => {
      result = coyl.isObject(() => null);

      assert.equal(result, false);
    });

    it("does not count other primative types as objects", () => {
      nonObjects = [-1,0,1,"string"];

      for (let i = 0; i < nonObjects.length; i++) {
        result = coyl.isObject(nonObjects[i]);
        assert.equal(result, false);
      }
    });
  });

  describe("mutate", () => {});

  describe("match & nmatch", () => {});
});
