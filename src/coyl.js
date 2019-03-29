var random = require('./random.js');
var stringMutator = require('./stringMutator.js');

const DEFAULTOPTIONS = {
  mutationRate: 0, // values should be between 0 and 1. 0: nothing changes, 1: everything changes
  boolean: {
    mutateDistance: 1,
    // mutator: (value, typeOptions) => newValue,
  },
  string: {
    stringEditDistance: 1,
    // addableCharacters: "",
    mutateDistance: 1,
    // mutator: (value, typeOptions) => newValue,
  },
  integer: {
    mutateDistance: 1,
    // mutator: (value, typeOptions) => newValue,
  },
  float: {
    mutateDistance: 1,
    mutateDistance: 1,
    // mutator: (value, typeOptions) => newValue,
  },
};

function coyl() {
  let assignProps = (obj, callback) => {
    for (var property in obj) {
      if (obj.hasOwnProptery(property)) {
        obj[property] = callback(obj[property]);
      }
    }
  };

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

    if (options.mutationRate > 0) {
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

      let shouldMutate = random.next() <= options.mutationRate;
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

        const typeOptions = options[type];

        // If item is not a recursive type and a custom mutation function is provided,
        // use that instead of default mutator
        if (typeOptions.hasOwnProperty("mutator")) {
          const mutator = typeOptions["mutator"];
          return mutator(item, typeOptions);
        }

        // Boolean
        if (type === "boolean") {
          item = !item;
          return item;
        }

        // String
        if (type === "string") {
          for (let i = 0; i < typeOptions.stringEditDistance; i++) {
            item = stringMutator.edit(item, typeOptions);
          }
          return item;
        }

        // Integer
        if (type === "integer") {
          const factor = random.next() > 0.5 ? 1 : -1;
          const change = (Math.floor(random.next() * typeOptions.mutateDistance) + 1) * factor;
          item += change;
        }

        // Float
        if (type === "float") {
          const change = (random.next() * (2 * typeOptions.mutateDistance)) - typeOptions.mutateDistance;
          item += change;
        }
      }

      // For any missed cases, don't mutate
      return item;
    }
    return item;
  };

  this.match = (a, b, options) => {
    return this.nmatch([a, b], options);
  };

  this.nmatch = (parents, options) => {
    let matchOptions = { ...DEFAULTOPTIONS, ...options };

    // since different parents might different sets of attributes/properties,
    // then one parent is chosen as the attribute template for the child.
    let templateParent = parents[Math.floor(random.next() * parents.length)];
    let child = JSON.parse(JSON.stringify(templateParent));

      for (var property in child) {
        if (child.hasOwnProperty(property)) {
          const attributeParent = parents[Math.floor(random.next() * parents.length)];
          if (attributeParent.hasOwnProperty(property)) {
            const attributeValue = attributeParent[property];
            child[property] = attributeValue;
          }
        }
      }

    if (options.mutationRate > 0) {
      child = this.mutate(child, matchOptions);
    }

    return child;
  };
};

const Coyl = new coyl();
module.exports = Coyl;
