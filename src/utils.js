const { execSync } = require('child_process')

const fs = require('fs')
const path = require('path')

// https://github.com/nuxt/nuxt.js/blob/dev/packages/cli/src/utils/dir.js
const isNuxtDir = rootDirectory => {
  if (fs.existsSync(path.join(rootDirectory, 'nuxt.config.js')) ||
    fs.existsSync(path.join(rootDirectory, 'pages')) ||
    fs.existsSync(path.join(rootDirectory, 'nuxt.config.ts'))) {
    return true
  }
  return false
}

const removeDirectory = directoryPath => {
  if (fs.existsSync(directoryPath)) {
    fs.rmSync(directoryPath, { recursive: true })
  }
}

const removeDuplicates = arr => Array.from(new Set(arr))

const mergeArrays = arrays => [].concat(...arrays)

const getChangedFiles = extension => {
  const extensionFilter = extension ? `-- '***.${extension}'` : ''
  const command = `git diff HEAD --name-only ${extensionFilter}`
  const diffOutput = execSync(command)

  return diffOutput.toString().split('\n').filter(Boolean)
}

module.exports = {
  isNuxtDir,
  removeDirectory,
  removeDuplicates,
  getChangedFiles,
  mergeArrays
}
