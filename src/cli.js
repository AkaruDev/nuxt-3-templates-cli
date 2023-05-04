const c = require('ansi-colors')
const { version } = require('../package.json')
const Log = require('./Log.js')

const INSTALL_COMMAND = 'install'
const CONFIG_COMMAND = 'get-config'
const COMMANDS = [INSTALL_COMMAND, CONFIG_COMMAND]

const HELP_ARGUMENT = '--help'
const HELP_ARGUMENT_ALIAS = '-h'
const VERSION_ARGUMENT = '--version'
const VERSION_ARGUMENT_ALIAS = '-v'
const INSTALL_TOKEN_ARGUMENT = '--token'
const INSTALL_REPOSITORY_ARGUMENT = '--repository'
const INSTALL_TMP_DIRECTORY_ARGUMENT = '--tmp'

const Cli = {
  INSTALL_COMMAND,
  CONFIG_COMMAND,

  args: null,

  command: null,

  arguments: {
    help: false,
    version: false,
    token: null,
    repository: null,
    tmpDirectory: null
  },

  getCommand () {
    const maybeCommand = this.args[0]

    if (!COMMANDS.includes(maybeCommand)) return

    this.command = maybeCommand
  },

  getArguments () {
    // Help
    if (this.args.includes(HELP_ARGUMENT) || this.args.includes(HELP_ARGUMENT_ALIAS)) {
      this.arguments.help = true

      return
    }

    // Version
    if (process.argv.slice(1).includes(VERSION_ARGUMENT) || process.argv.slice(1).includes(VERSION_ARGUMENT_ALIAS)) {
      this.arguments.version = true

      return
    }

    // token
    if (this.args.includes(INSTALL_TOKEN_ARGUMENT)) {
      const tokenArgumentIndex = this.args.findIndex(argument => argument === INSTALL_TOKEN_ARGUMENT)
      if (tokenArgumentIndex > -1 && this.args?.[tokenArgumentIndex + 1]) this.arguments.token = this.args?.[tokenArgumentIndex + 1]
    }

    // repository
    if (this.args.includes(INSTALL_REPOSITORY_ARGUMENT)) {
      const repositoryArgumentIndex = this.args.findIndex(argument => argument === INSTALL_REPOSITORY_ARGUMENT)
      if (repositoryArgumentIndex > -1 && this.args?.[repositoryArgumentIndex + 1]) this.arguments.repository = this.args?.[repositoryArgumentIndex + 1]
    }

    // tmp directory
    if (this.args.includes(INSTALL_TMP_DIRECTORY_ARGUMENT)) {
      const tmpArgumentIndex = this.args.findIndex(argument => argument === INSTALL_TMP_DIRECTORY_ARGUMENT)
      if (tmpArgumentIndex > -1 && this.args?.[tmpArgumentIndex + 1]) this.arguments.tmpDirectory = this.args?.[tmpArgumentIndex + 1]
    }
  },

  parse () {
    this.args = process.argv.slice(2)

    this.getCommand()
    this.getArguments()
  },

  logHelp () {
    Log.log(`${c.bold.underline('Nuxt templates CLI')}

${c.bold('Commands')}:
    ${INSTALL_COMMAND}: Install one or more features

${c.bold('Arguments')}:
    ${HELP_ARGUMENT} | ${HELP_ARGUMENT_ALIAS}: Display this help
    ${INSTALL_TOKEN_ARGUMENT}: Create a token (https://github.com/settings/tokens) to extend API limit
    ${INSTALL_REPOSITORY_ARGUMENT}: Github repository name (default: AkaruDev/nuxt-3-templates)
    ${INSTALL_TMP_DIRECTORY_ARGUMENT}: Temporary directory to download files, use an empty directory (default: ./tmp)

${c.bold('Examples')}:
    nuxt-3-templates ${INSTALL_COMMAND} ${INSTALL_TOKEN_ARGUMENT} abc123
`)
  },

  logVersion () {
    Log.log(`${c.bold.underline('Nuxt templates CLI')} ${c.bold(version)}`)
  }
}

module.exports = Cli
