const inquirer = require('inquirer')
const c = require('ansi-colors')

const { getFeatures } = require('./Github.js')
const { install } = require('./Installer.js')
const DependenciesInstaller = require('./DependenciesInstaller.js')
const Config = require('./Config.js')
const { removeDirectory, isNuxtDir } = require('../../utils.js')
const Log = require('../../Log.js')

/**
 * Get all available features from Github repo,
 * then display them in a checkbox list to let user choose which ones he wants to add
 *
 * @returns {Array} Array of features objects selected by user
 */
const getFeaturesToInstall = async _ => {
  const availableFeatures = await getFeatures()

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
        name: `${feature.metas.title.padEnd(longestFeatureTitle + 10, ' ')} ${feature.metas?.description}`,
        value: feature.uid,
        short: feature.metas.title,
        checked: false
      }

      const title = new inquirer.Separator(`\n${c.whiteBright.bold.underline(feature.metas.category)}\n`)

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

  const { features: featuresUidsToInstall } = await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select features',
        choices,
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
    await install(featuresToInstall[featureToInstallIndex], parseInt(featureToInstallIndex))
  }

  Log.blankLine()

  await DependenciesInstaller.installAll()

  Log.blankLine()

  Log.success('🎉 All features are installed')
}

const clean = _ => {
  removeDirectory(Config.tmpDirectory)
}

module.exports = {
  run,
  clean
}
