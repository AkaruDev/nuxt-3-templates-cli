#!/usr/bin/env node

import Cli from '../src/cli.js'
import Log from '../src/Log.js'
// const { getChangedFiles } = require('../src/utils.js')

// Commands
import Install from '../src/commands/install/index.js'
import GetConfig from '../src/commands/get-config/index.js'

Log.blankLine()

// Get commands and arguments from CLI entry
Cli.parse()

// Version argument
if (Cli.options.version) {
  Cli.logVersion()
  process.exit(0)
}

// No command or help argument
if (!Cli.command || Cli.options.help) {
  Cli.logHelp()
  process.exit(0)
}

// Install features
if (Cli.command === Cli.INSTALL_COMMAND) {
  process.on('exit', Install.clean)

  // Check if git has unstaged files, abort and warn
  /*
  const changedFiles = getChangedFiles() || []
  if (Array.isArray(changedFiles) && changedFiles.length > 0) {
    const errorMessage = 'You have uncommited changes. Save them before install.'
    throw errorMessage
  }
  */

  Install.run(Cli.options)
    .then(() => {
      Log.blankLine()
      Log.log('Just one more step!')
      GetConfig.run(Cli.options)
        .catch(error => {
          if (error) console.error('Error:', error)
        })
    })
    .catch(error => {
      if (error) console.error('Error:', error)
    })

  /* */
}

if (Cli.command === Cli.CONFIG_COMMAND) {
  GetConfig.run(Cli.options)
    .catch(error => {
      if (error) console.error('Error:', error)
    })
}
