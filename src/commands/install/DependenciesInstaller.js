import lmify from 'lmify'
const install = lmify.install
import utils from '../../utils.js'
const { removeDuplicates } = utils
import Log from '../../Log.js'

const DependenciesInstaller = {
  dependencies: [],
  devDependencies: [],

  addDependencies (dependencies) {
    if (!Array.isArray(dependencies)) dependencies = [dependencies]

    this.dependencies.push(...dependencies)
  },

  addDevDependencies (dependencies) {
    if (!Array.isArray(dependencies)) dependencies = [dependencies]

    this.devDependencies.push(...dependencies)
  },

  async installDependencies () {
    Log.subtitle('Installing dependencies...')
    Log.log(this.dependencies.join(', '))
    Log.blankLine()

    await install(this.dependencies)

    Log.blankLine()
  },

  async installDevDependencies () {
    Log.subtitle('Installing dev dependencies...')
    Log.log(this.devDependencies.join(', '))
    Log.blankLine()

    await install(['-D', ...this.devDependencies])

    Log.blankLine()
  },

  async installAll () {
    if (!this.dependencies.length && !this.devDependencies.length) return

    Log.blankLine()
    Log.title('Package dependencies')
    Log.blankLine()

    this.dependencies = removeDuplicates(this.dependencies)
    this.dependencies.length && await this.installDependencies()

    this.devDependencies = removeDuplicates(this.devDependencies)
    this.devDependencies.length && await this.installDevDependencies()

    Log.blankLine()
  }
}

export default DependenciesInstaller
