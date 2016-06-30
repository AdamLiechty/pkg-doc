const doc = require('./index')
const output = (process.argv.length > 2) ? process.argv[2] : './doc/third-party.md'
doc(output)
