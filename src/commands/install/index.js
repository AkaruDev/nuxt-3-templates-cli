import colors from 'ansi-colors'

import Github from './Github.js'
import Installer from './Installer.js'
import DependenciesInstaller from './DependenciesInstaller.js'
import Config from './Config.js'
import _default from '../../utils.js'
const { removeDirectory, isNuxtDir } = _default
import Log from '../../Log.js'

/**
 * Get all available features from Github repo,
 * then display them in a checkbox list to let user choose which ones he wants to add
 *
 * @returns {Array} Array of features objects selected by user
 */
const getFeaturesToInstall = async () => {
  const inquirer = (await import('inquirer')).default
  const availableFeatures = await Github.getFeatures()

  const longestFeatureTitle = availableFeatures
    .reduce((currentLongestFeatureTitle, feature) => {
      if (feature.metas.title.length > currentLongestFeatureTitle) currentLongestFeatureTitle = feature.metas.title.length

      return currentLongestFeatureTitle
    }, 0)

  // Group by category
  let choices = availableFeatures
    .reduce((acc, feature) => {
      feature.metas.category = feature.metas.category || 'Other'
      const categoryKey = feature.metas.category
        .toLowerCase()
        .replace(/\//g, '')
        .replace(/\s+/g, '_')

      const choice = {
        name: (`${feature.metas.title.padEnd(longestFeatureTitle, ' - ')} ${feature.metas?.description}`),
        value: feature.uid,
        short: feature.metas.title,
        checked: false
      }

      const title = new inquirer.Separator(`\n${colors.whiteBright.bold.underline(feature.metas.category)}\n`)

      acc[categoryKey] = {
        title,
        children: [...acc?.[categoryKey]?.children || [], choice]
      }

      return acc
    }, {})

  // Flatten all
  choices = Object.values(choices)
    .reduce((acc, curr) => {
      acc.push(curr.title)
      acc.push(...curr.children)
      return acc
    }, [])

  // FIX for weird display of checkbox
  // TODO check when choices list is longer if bug still exist
  choices.forEach(() => {
    choices.push({
      type: 'separator',
      line: '\x1B[2m\x1B[22m\n\x1B[2m\x1B[97m\x1B[1m\x1B[4m\x1B[24m\x1B[22m\x1B[2m\x1B[39m\x1B[22m\n\x1B[2m\x1B[22m'
    })
  })

  const { features: featuresUidsToInstall } = await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features',
        choices: choices,
        pageSize: choices.length,
        loop: false
      }
    ])

  return availableFeatures
    .filter(availableFeature => featuresUidsToInstall.includes(availableFeature.uid))
}

const run = async cliArgs => {
  Config.merge(cliArgs)

  if (!isNuxtDir(process.cwd())) {
    throw String('Not a Nuxt directory')
  }

  const featuresToInstall = await getFeaturesToInstall()

  Log.blankLine()

  for (const featureToInstallIndex in featuresToInstall) {
    await Installer.install(featuresToInstall[featureToInstallIndex], parseInt(featureToInstallIndex))
  }

  Log.blankLine()

  await DependenciesInstaller.installAll()

  Log.blankLine()

  Log.success('🎉 All features are installed')
}

const clean = () => {
  removeDirectory(Config.tmpDirectory)
}

export default {
  run,
  clean
}
