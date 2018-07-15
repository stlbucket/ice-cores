
// Update with your config settings.
require('./config')

module.exports = Object.assign(
  // require('./src/auth').knexfile(),
  require('./patches/0010-ice-core').knexfile()
)
