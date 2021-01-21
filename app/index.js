const { NODE_ENV, LOCAL_ENVS } = require("./lib/constants");

if (LOCAL_ENVS.includes(NODE_ENV)) {
  // Transpile all code following this line with babel and use '@babel/preset-env' (aka ES6) preset.
  require("@babel/register");
}
module.exports = require("./app");
