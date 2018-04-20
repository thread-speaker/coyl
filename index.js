function coyl() {
  this.mutate = function(item) {
    return item;
  };

  this.match = function(a, b, options) {
    return this.nmatch([a, b], options);
  };

  this.nmatch = function(parents, options) {
    let matchOptions = Object.assign({
      mutate: false,
    }, options);

    let attributeParent = parents[Math.floor(Math.random() * parents.length)];
    let child = JSON.parse(JSON.stringify(attributeParent));

    for (var property in child) {
      if (child.hasOwnProperty(property)) {
        const attributeValue = parents[Math.floor(Math.random() * parents.length)][property];
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
