const async = require('async')
const exec = require('child_process').exec

async.series([
  async.apply(exec, 'firebase login'),
  async.apply(exec, 'firebase use --add')
])

require('./importDecks')()
require('./writeEnv')()