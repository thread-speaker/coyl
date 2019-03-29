var assert = require('assert');

var coyl = require('../src/coyl.js');
var random = require('../src/random.js');
var getEditDistance = require('./helpers/levenshtein.js');

describe("coyl", () => {
  const defaultTestOptions = {
    mutate: true,
    mutationRate: 1,
  };
  const testOptions = (options = {}) => {
    return { ...defaultTestOptions, ...options };
  };

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

  describe("mutate", () => {
    describe("boolean", () => {
      it("adjusts the value", () => {
        const input = true;
        const output = coyl.mutate(input, testOptions());
        assert.notEqual(input, output);
      });

      it("uses defined mutator if defined in options", () => {
        const input = true;
        const input2 = false;
        const expected = true;
        const options = testOptions({ boolean: { mutator: () => true } });

        const output = coyl.mutate(input, options);
        const output2 = coyl.mutate(input2, options);

        assert.equal(output, expected);
        assert.equal(output2, expected);
      });
    });

    describe("integer", () => {
      it("adjusts the value within mutateDistance", () => {
        const input = 10;
        const testDistance = 10;

        for (let i = 0; i < 10; i++) {
          const output = coyl.mutate(input, testOptions({ integer: { mutateDistance: testDistance } }));
          assert.notEqual(input, output);
          assert.ok(output <= input + testDistance);
          assert.ok(output >= input - testDistance);
        }
      });

      it("uses defined mutator if defined in options", () => {
        const input = 10;
        const expected = 20;
        const options = testOptions({ integer: { mutator: () => 20 } });

        const output = coyl.mutate(input, options);

        assert.equal(output, expected);
      });
    });

    describe("float", () => {
      it("adjusts the value within mutateDistance", () => {
        const input = 10.1;
        const testDistance = 10;

        for (let i = 0; i < 10; i++) {
          const output = coyl.mutate(input, testOptions({ float: { mutateDistance: testDistance } }));
          assert.notEqual(input, output);
          assert.ok(output <= input + testDistance);
          assert.ok(output >= input - testDistance);
        }
      });

      it("uses defined mutator if defined in options", () => {
        const input = 10.1;
        const expected = 20.5;
        const options = testOptions({ float: { mutator: () => 20.5 } });

        const output = coyl.mutate(input, options);

        assert.equal(output, expected);
      });
    });

    describe("string", () => {
      it("adjusts the value within editDistance", () => {
        const input = "foobaz";
        const ed = 3;
        const options = testOptions({ string: { editDistance: ed } });

        for (let i = 0; i < 10; i++) {
          const output = coyl.mutate(input, options);
          assert.notEqual(input, output);
          assert.ok(getEditDistance(input, output) <= ed);
        }
      });

      it("uses defined mutator if defined in options", () => {
        const input = "foobaz";
        const expected = "pie!";
        const options = testOptions({ string: { mutator: () => "pie!" } });

        const output = coyl.mutate(input, options);

        assert.equal(output, expected);
      });
    });

    describe("array", () => {
      it("mutates each element", () => {
        const input = [123, true];

        const output = coyl.mutate(input, testOptions());

        assert.equal(output.length, input.length);
        for (let i = 0; i < output.length; i++) {
          assert.notEqual(input[i], output[i]);
        }
      });
    });

    describe("object", () => {
      it("mutates each element", () => {
        const input = {
          num: 123,
          bool: true,
        };

        const output = coyl.mutate(input, testOptions());

        for (var property in output) {
          if (output.hasOwnProperty(property)) {
            assert.notEqual(input[property], output[property]);
          }
        }
      });
    });
  });

  describe("match & nmatch", () => {
    it("match calls mutate", () => {
      let seed = 123;
      random.setSeed(seed);

      let parentValue = 123;
      let result = coyl.match(parentValue, parentValue, testOptions());
      assert.notEqual(result, parentValue)
    });

    it("nmatch calls mutate", () => {
      let seed = 123;
      random.setSeed(seed);

      let parentValue = 123;
      let result = coyl.nmatch([parentValue], testOptions());
      assert.notEqual(result, parentValue)
    });
  });
});
