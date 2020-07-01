function buildConfig(env) {
  var file = './config/webpack.' + env + '.js';
  return require(file)({env: env});
}

module.exports = buildConfig;