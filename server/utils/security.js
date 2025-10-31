function randomDelay(min = 200, max = 500) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}

module.exports = { randomDelay };

/*
* The idea: timing attacks happen when a hacker measures how
  long your system takes to respond and deduces info
  (like if a token exists or not).
* */