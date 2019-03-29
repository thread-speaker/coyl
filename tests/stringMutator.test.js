var assert = require('assert');

var random = require('../src/random.js');
var mutator = require('../src/stringMutator.js');

describe("stringMutator", () => {
  it("can add to a string", () => {
    const original = "hello";

    result = mutator.add(original);

    assert.equal(result.length, original.length + 1);
  });

  it("can add to an empty string", () => {
    const original = "";

    result = mutator.add(original);

    assert.equal(result.length, original.length + 1);
  });

  it("can replace in a string", () => {
    const original = "hello";

    result = mutator.replace(original);

    assert.equal(result.length, original.length);
    assert.notEqual(result, original);
  });

  it("can not replace in an empty string", () => {
    const original = "";

    result = mutator.replace(original);

    assert.equal(result, original);
  });

  it("can remove from a string", () => {
    const original = "hello";

    result = mutator.remove(original);

    assert.equal(result.length, original.length - 1);
  });

  it("can not remove from an empty string", () => {
    const original = "";

    result = mutator.remove(original);

    assert.equal(result, original);
  });

  it("doesn't have issues when calling edit", () => {
    const original = "hello";

    let result = original;
    for (let i = 0; i < 10; i++) {
      result = mutator.edit(result);
    }

    assert.notEqual(result, original);
  });

  it("edit always adds to an empty string", () => {
    const original = "";

    for (let i = 0; i < 10; i++) {
      let result = mutator.edit(original);
      assert.equal(result.length, original.length + 1);
    }
  });
});
