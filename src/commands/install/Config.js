const path = require('path')

const Config = {
  rootDirectory: process.cwd(),
  token: null,
  repository: 'AkaruDev/nuxt-3-templates',
  tmpDirectory: 'tmp',

  merge (cliArgs) {
    const { token, repository, tmpDirectory } = cliArgs

    this.token = token || this.token

    this.repository = repository || this.repository

    this.tmpDirectory = tmpDirectory || this.tmpDirectory
    this.tmpDirectory = path.resolve(this.rootDirectory, this.tmpDirectory)
  }
}

module.exports = Config
