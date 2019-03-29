var assert = require('assert');

var random = require('../src/random.js');

describe("random", () => {
  it("can set the random seed", () => {
    let seed = 123;
    random.setSeed(seed);

    assert.equal(random.getSeed(), seed)
  });

  it("updates the seed after generating a random number", () => {
    let seed = 123;
    random.setSeed(seed);
    random.next();

    result = random.getSeed();
    assert.notEqual(result, seed);
  });

  it("generates the same pseudo-random number from the same seed", () => {
    let seed = 123;

    random.setSeed(seed);
    firstResult = random.next();

    random.setSeed(seed);
    secondResult = random.next();

    assert.equal(firstResult, secondResult);
  });
});
