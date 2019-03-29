// seed is initialized with Math.random, but all other pseudo-random numbers
// will be generated via the seed.
var seed = Math.random();

function random() {
  // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
  // Slower than Math.random() but allows the use of a seed
  // variable, which can be set by users if needed.
  this.next = () => {
    var x = Math.sin(++seed) * 10000;
    return x - Math.floor(x);
  };

  this.setSeed = (val) => {
    seed = val;
  };

  this.getSeed = () => seed;
}

const Random = new random();
module.exports = Random;
