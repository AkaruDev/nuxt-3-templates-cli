import fs from "fs"

import { resolve } from 'path'
import colors from 'ansi-colors'
import Log from '../../Log.js'

// Returns an array of each features config
const getFeaturesConfigs = async () => {
  const CONFIGS_PATH = resolve(process.cwd(), 'configs')

  if (!fs.existsSync(CONFIGS_PATH)) {
    return []
  }
  const configsFilesNames = await fs.promises.readdir(CONFIGS_PATH)

  return configsFilesNames.map(path => `'./configs/${path}'`)
}

const run = async () => {
  const clipboard = (await (import('clipboardy'))).default

  const configs = await getFeaturesConfigs()

  const content = configs.join(',\n') // await fsPromises.readFile(path.resolve(__dirname, 'nuxt.config.ts'), { encoding: 'utf8' })

  clipboard.writeSync(content)
  Log.blankLine()
  Log.log('📝 Extends content is copied in your clipboard!')
  Log.log('Paste your entries in the extends params of nuxt.config.ts.')
  Log.log('Exemple: ')
  Log.log(colors.cyan(`export default defineNuxtConfig({
    extends:[
      ${content}
    ]
  })`
  )
  )
}

export default {
  run
}
