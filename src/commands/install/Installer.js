import { execSync } from 'child_process'
import { basename } from 'path'
import download from 'download'
import colors from 'ansi-colors'
const { cyan } = colors
import { SingleBar, Presets } from 'cli-progress'
import Log from '../../Log.js'
import DependenciesInstaller from './DependenciesInstaller.js'
import Github from './Github.js'
const { recursivelyGetDirectoryContent, getDirectoryContent } = Github
import utils from '../../utils.js'

const install = async ({ uid, metas, branchName, dependencies, devDependencies, installCommands, files, postInstall } = {}, index) => {
  const fileDownloadsPromises = []

  // Add dependencies
  if (dependencies) {
    DependenciesInstaller.addDependencies(dependencies)
  }

  // Add devDependencies
  if (devDependencies) {
    DependenciesInstaller.addDevDependencies(devDependencies)
  }

  /**
   *
   * Files
   *
   */
  const progressBar = new SingleBar({
    format: `${cyan('{bar}')} {percentage}% ({value}/{total})`
  }, Presets.shades_classic)

  if (files) {
    // Glob all files
    const allFilesPromises = files.map(file => recursivelyGetDirectoryContent(file, branchName))
    let allFiles = await Promise.all(allFilesPromises)
    allFiles = utils.mergeArrays(allFiles)

    // Store download promises
    fileDownloadsPromises.push(...allFiles.map(file => async () => {
      await download(file.downloadUrl, file.pathDirectory, {
        filename: basename(file.downloadUrl)
      })
      progressBar.increment()
    }))
  }

  /**
   *
   * Config
   *
   */
  const configFile = (await getDirectoryContent('config.js', branchName))?.[0]

  if (configFile) {
    fileDownloadsPromises.push(async () => {
      await download(configFile.downloadUrl, 'configs', {
        filename: `nuxt.config.${uid}.js`
      })

      progressBar.increment()
    })
  }

  index === 0 && Log.separator()
  Log.blankLine()
  Log.subtitle(metas.title)
  Log.log('Downloading files...')

  // Run all download promises
  progressBar.start(fileDownloadsPromises.length, 0)
  await Promise.all(fileDownloadsPromises.map(fn => fn()))
  progressBar.stop()

  /**
   *
   * Install commands
   *
   */
  if (installCommands) {
    Log.blankLine()

    Log.log('Running install commands...')

    Log.blankLine()

    installCommands
      .forEach(installCommand => execSync(installCommand, { stdio: 'inherit' }))
  }

  /**
   *
   * Post install
   *
   */
  if (postInstall) {
    Log.blankLine()

    postInstall(Log)
  }

  Log.blankLine()
  Log.separator()
}

export default {
  install
}
