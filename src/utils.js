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

const removeDirectory = async directoryPath => {
  await fs.rmSync(directoryPath, { recursive: true })
}

const removeDuplicates = arr => Array.from(new Set(arr))

const mergeArrays = arrays => [].concat(...arrays)

module.exports = {
  isNuxtDir,
  removeDirectory,
  removeDuplicates,
  mergeArrays
}
