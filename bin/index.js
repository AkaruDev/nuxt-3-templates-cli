#!/usr/bin/env node

const Cli = require('../src/cli.js')
const Log = require('../src/Log.js')
// const { getChangedFiles } = require('../src/utils.js')

// Commands
const install = require('../src/commands/install/index.js')
const getConfig = require('../src/commands/get-config/index.js')

Log.blankLine()

// Get commands and arguments from CLI entry
Cli.parse()

// Version argument
if (Cli.arguments.version) {
  Cli.logVersion()
  process.exit(0)
}

// No command or help argument
if (!Cli.command || Cli.arguments.help) {
  Cli.logHelp()
  process.exit(0)
}

// Install features
if (Cli.command === Cli.INSTALL_COMMAND) {
  process.on('exit', install.clean)

  // Check if git has unstaged files, abort and warn
  /*
  const changedFiles = getChangedFiles() || []
  if (Array.isArray(changedFiles) && changedFiles.length > 0) {
    const errorMessage = 'You have uncommited changes. Save them before install.'
    throw errorMessage
  }
  */

  install
    .run(Cli.arguments)
    .then(() => {
      Log.blankLine()
      Log.log('Just one more step!')
      getConfig
        .run(Cli.arguments)
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
  getConfig
    .run(Cli.arguments)
    .catch(error => {
      if (error) console.error('Error:', error)
    })
}
