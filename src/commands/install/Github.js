import { parse as pathParse, resolve as pathResolve } from 'path'
import download from 'download'
import Config from './Config.js'
import { Octokit } from "octokit";

const owner = 'AkaruDev'
const repo = 'nuxt-3-templates'


const getFeaturesBranchesNames = async (octokit) => {
  const branches = await octokit.request(`GET /repos/${owner}/${repo}/branches?per_page=100`, {
    owner: 'OWNER',
    repo: 'REPO',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return branches.data.filter(({ name }) => name.includes('features/'))
    .map(({ name }) => name)
}

const getFeatures = async () => {
  const octokit = new Octokit({ auth: Config.token });
  const branchesNames = await getFeaturesBranchesNames(octokit)

  const promises = branchesNames
    .map(async branchName => {
      try {
        const uid = branchName.replace("features/", "")
        const path = 'nuxt-templates-cli.js'
        const installationFile = await octokit.request(`GET /repos/${owner}/${repo}/contents/${path}?ref=${branchName}`, {
          owner: 'OWNER',
          repo: 'REPO',
          path: 'PATH',
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })

        const featureTmpDirectory = pathResolve(Config.tmpDirectory, uid)
        await download(installationFile.data.download_url, featureTmpDirectory)
        const filePath = `file:///${featureTmpDirectory}/nuxt-templates-cli.js`
        const { metas, dependencies, devDependencies, installCommands, files, postInstall } = await import(filePath)

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
      } catch (error) {
        console.warn(error)
        return null
      }
    })

  return (await Promise.all(promises))
    .filter(v => !!v)
}

const getDirectoryContent = async (directoryPath, branchName = 'master') => {
  const octokit = new Octokit({ auth: Config.token });
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
    const contents = await octokit.request(`GET /repos/${owner}/${repo}/contents/${directoryPath}?ref=${branchName}`, {
      owner: 'OWNER',
      repo: 'REPO',
      path: 'PATH',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (!Array.isArray(contents.data)) {
      return [parseFileOrDir(contents.data)]
    }

    return contents.data
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

export default {
  getFeatures,
  getDirectoryContent,
  recursivelyGetDirectoryContent
}
