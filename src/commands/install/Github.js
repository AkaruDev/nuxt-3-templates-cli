const { parse: pathParse, resolve: pathResolve } = require('path')
const github = require('octonode')
const download = require('download')
const Config = require('./Config')

let ghrepo

const getRepo = () => {
  if (!ghrepo) {
    const client = github.client(Config.token)
    ghrepo = client.repo(Config.repository)
  }

  return ghrepo
}

const getFeaturesBranchesNames = async _ => {
  const [branches] = await getRepo().branchesAsync({
    per_page: 100
  })

  return branches
    .filter(({ name }) => name.includes('features'))
    .map(({ name }) => name)
}

const getFeatures = async _ => {
  const branchesNames = await getFeaturesBranchesNames()

  const promises = branchesNames
    .map(async branchName => {
      try {
        const uid = branchName.replace('features/', '')
        const [installationFile] = await getRepo().contentsAsync('nuxt-templates-cli.js', branchName)

        const featureTmpDirectory = pathResolve(Config.tmpDirectory, uid)

        await download(installationFile.download_url, featureTmpDirectory)

        const { metas, dependencies, devDependencies, installCommands, files, postInstall } = require(`${featureTmpDirectory}/nuxt-templates-cli.js`)

        if (!metas?.title || typeof metas.title !== 'string') return null

        return {
          uid,
          featureTmpDirectory,
          branchName,
          metas,
          dependencies,
          devDependencies,
          installCommands,
          files,
          postInstall
        }
      } catch (_) {
        return null
      }
    })

  return (await Promise.all(promises))
    .filter(v => !!v)
}

const getDirectoryContent = async (directoryPath, branchName = 'master') => {
  const parseFileOrDir = fileOrDir => {
    const { name, download_url: downloadUrl, type, path } = fileOrDir

    let pathDirectory = pathParse(path).dir
    if (pathDirectory === '') pathDirectory = './'

    return {
      name,
      pathDirectory,
      path,
      type,
      downloadUrl
    }
  }

  try {
    const [directoryContents] = await getRepo().contentsAsync(directoryPath, branchName)

    if (!Array.isArray(directoryContents)) {
      return [parseFileOrDir(directoryContents)]
    }

    return directoryContents
      .map(parseFileOrDir)
  } catch (_) {
    return null
  }
}

const recursivelyGetDirectoryContent = async (directoryPath, branchName, acc = []) => {
  const directoryContents = await getDirectoryContent(directoryPath, branchName)

  if (!directoryContents) {
    return acc
  }

  await Promise.all(directoryContents.map(async fileOrDir => {
    if (fileOrDir.type === 'file') {
      acc.push(fileOrDir)
    }

    if (fileOrDir.type === 'dir') {
      await recursivelyGetDirectoryContent(fileOrDir.path, branchName, acc)
    }
  }))

  return acc
}

module.exports = {
  getFeatures,
  getDirectoryContent,
  recursivelyGetDirectoryContent
}
