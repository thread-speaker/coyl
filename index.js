const DEFAULTOPTIONS = {
  // mutator: function() {},
  mutate: false,
  mutationRate: 0.1, // values should be between 0 and 1. 0: nothing changes, 1: everything changes
  stringEditDistance: 1,
};

// seed is initialized with Math.random, but all other pseudo-random numbers
// will be generated via the seed.
var seed = Math.random();

function coyl() {
  // https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
  // arrays and functions are technically objects, but for coyl's purposes
  // they should be treated differently, so isObject weeds them out.
  isObject(val) {
    return (
      val === Object(val) &&
      !Array.isArray(val) &&
      typeof(val) === typeof({})
    );
  };

  // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  // Slower than Math.random() but allows the use of a seed
  // variable, which can be set by users if needed.
  random() {
    var x = Math.sin(++seed) * 10000;
    return x - Math.floor(x);
  };

  assignProps(obj, callback) {
    for (var property in obj) {
      if (obj.hasOwnProptery(property) {
        obj[property] = callback(obj[property]);
      }
    }
  };

  this.setSeed(val) {
    seed = val;
  };

  this.mutate = function(item, options) {
    // If custom mutation function given, use that instead of default
    // (overrides options.mutate setting)
    if (options.mutator) {
      return options.mutator(item, options);
    }

    // Only mutate if option for it is true
    if (options.mutate) {
      /** Non-Recursive Types **/

      // Boolean
      if (typeof(item) === typeof(true)) {
        if (this.random() < options.mutationRate) {
          item = !item;
        }
        return item;
      }

      // Don't mutate item if falsey non-boolean
      if (!item) {
        return item;
      }

      /** Recursive types **/

      // For arrays, mutate each element
      if (Array.isArray(item)) {
        for (var index = 0; index < item.length; index++) {
          item[index] = this.mutate(item[index]);
        }
        return item;
      }

      // It item is an object, recursively mutate each property
      if (isObject(item)) {
        assignProps(item, this.mutate);
        return item;
      }

      // For any missed cases, don't mutate
      return item;
    }
  };

  this.match = function(a, b, options) {
    return this.nmatch([a, b], options);
  };

  this.nmatch = function(parents, options) {
    let matchOptions = Object.assign({}, DEFAULTOPTIONS, options);

    // since different parents might different sets of attributes/properties,
    // then one parent is chosen as the attribute template for the child.
    let attributeParent = parents[Math.floor(this.random() * parents.length)];
    let child = JSON.parse(JSON.stringify(attributeParent));

    for (var property in child) {
      if (child.hasOwnProperty(property)) {
        const attributeValue = parents[Math.floor(this.random() * parents.length)][property];
        child[property] = attributeValue;
      }
    }

    if (matchOptions.mutate) {
      if (matchOptions.mutator) {
        child = matchOptions.mutator(child);
      }
      else {
        child = this.mutate(child, options);
      }
    }

    return child;
  };
};

const Coyl = new coyl();
module.exports = Coyl;
