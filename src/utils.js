import { execSync } from 'child_process'

import fs from "fs"
import { join } from 'path'

// https://github.com/nuxt/nuxt.js/blob/dev/packages/cli/src/utils/dir.js
const isNuxtDir = rootDirectory => {
  if (fs.existsSync(join(rootDirectory, 'nuxt.config.js')) ||
    fs.existsSync(join(rootDirectory, 'pages')) ||
    fs.existsSync(join(rootDirectory, 'nuxt.config.ts'))) {
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
  if (!fs.existsSync(join(process.cwd(), '.git'))) return []

  const extensionFilter = extension ? `-- '***.${extension}'` : ''
  const command = `git diff HEAD --name-only ${extensionFilter}`
  const diffOutput = execSync(command)

  return diffOutput.toString().split('\n').filter(Boolean)
}

export default {
  isNuxtDir,
  removeDirectory,
  removeDuplicates,
  getChangedFiles,
  mergeArrays
}
