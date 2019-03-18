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

  this.mutate = (item, options = {}) => {
    // Don't mutate the original item, instead duplicate it and mutate that.
    item = JSON.parse(JSON.stringify(item));
    options = { ...DEFAULTOPTIONS, ...options };

    // Only mutate if option for it is true
    if (options.mutate) {
      /** Recursive types **/

      // For arrays, mutate each element
      if (Array.isArray(item)) {
        for (var index = 0; index < item.length; index++) {
          item[index] = this.mutate(item[index], options);
        }
        return item;
      }

      // It item is an object, recursively mutate each property
      if (this.isObject(item)) {
        for (var property in item) {
          if (item.hasOwnProperty(property)) {
            item[property] = this.mutate(item[property], options);
          }
        }
        return item;
      }

      /** Non-Recursive Types **/

      let shouldMutate = this.random() <= options.mutationRate;
      if (shouldMutate) {
        // Get the type of the item to mutate. If it is a number, determine if it it an integer or float.
        let type = typeof item;
        if (type === "number") {
          if (Number.isInteger(item)) {
            type = "integer";
          }
          else {
            type = "float";
          }
        }

        // If item is not a recursive type and a custom mutation function is provided,
        // use that instead of default mutator
        if (options.mutators.hasOwnProperty(type)) {
          const mutator = options.mutators[type];
          return mutator(item, options);
        }

        // Boolean
        if (type === "boolean") {
          if (this.random() < options.mutationRate) {
            item = !item;
          }
          return item;
        }

        // Integer
        if (type === "integer") {
          const factor = this.random() > 0.5 ? 1 : -1;
          const change = (Math.floor(this.random() * options.numberMutateDistance) + 1) * factor;
          item += change;
        }

        // Float
        if (type === "float") {
          const change = (this.random() * (2 * options.numberMutateDistance)) - options.numberMutateDistance;
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
    let matchOptions = { ...DEFAULTOPTIONS, ...options };

    // since different parents might different sets of attributes/properties,
    // then one parent is chosen as the attribute template for the child.
    let templateParent = parents[Math.floor(this.random() * parents.length)];
    let child = JSON.parse(JSON.stringify(templateParent));

      for (var property in child) {
        if (child.hasOwnProperty(property)) {
          const attributeParent = parents[Math.floor(this.random() * parents.length)];
          if (attributeParent.hasOwnProperty(property)) {
            const attributeValue = attributeParent[property];
            child[property] = attributeValue;
          }
        }
      }

    if (matchOptions.mutate) {
      child = this.mutate(child, matchOptions);
    }

    return child;
  };
};

const Coyl = new coyl();
module.exports = Coyl;
