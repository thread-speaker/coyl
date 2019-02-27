const DEFAULTOPTIONS = {
  mutators: {
    // string: (value, options) => {},
    // number: (value, options) => {},
  },
  mutate: false,
  mutationRate: 0.1, // values should be between 0 and 1. 0: nothing changes, 1: everything changes
  stringEditDistance: 1,
  numberMutateDistance: 1,
};

// seed is initialized with Math.random, but all other pseudo-random numbers
// will be generated via the seed.
var seed = Math.random();

function coyl() {
  // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  // Slower than Math.random() but allows the use of a seed
  // variable, which can be set by users if needed.
  this.random = () => {
    var x = Math.sin(++seed) * 10000;
    return x - Math.floor(x);
  };

  let assignProps = (obj, callback) => {
    for (var property in obj) {
      if (obj.hasOwnProptery(property)) {
        obj[property] = callback(obj[property]);
      }
    }
  };

  this.setSeed = (val) => {
    seed = val;
  };

  this.getSeed = () => seed;

  // https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
  // arrays and functions are technically objects, but for coyl's purposes
  // they should be treated differently, so isObject weeds them out.
  this.isObject = (val) => {
    return (
      val === Object(val) &&
      !Array.isArray(val) &&
      typeof(val) === typeof({})
    );
  };

  this.mutate = (item, options) => {
    // Only mutate if option for it is true
    if (options.mutate) {
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

      /** Non-Recursive Types **/

      let shouldMutate = this.random() <= options.mutationRate;
      if (shouldMutate) {
        // If item is not a recursive type and a custom mutation function is provided,
        // use that instead of default mutator
        let type = typeof item;
        if (options.mutators[type]) {
          return options.mutator(item, options);
        }

        // Boolean
        if (typeof(item) === typeof(true)) {
          if (this.random() < options.mutationRate) {
            item = !item;
          }
          return item;
        }

        // Number
        if (typeof(item) === typeof(1)) {
          let change = (this.random() * (2 * numberMutateDistance)) - numberMutateDistance;
          item += change;
        }
      }

      // For any missed cases, don't mutate
      return item;
    }
  };

  this.match = (a, b, options) => {
    return this.nmatch([a, b], options);
  };

  this.nmatch = (parents, options) => {
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
