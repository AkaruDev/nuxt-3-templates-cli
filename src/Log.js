const c = require('ansi-colors')

const SEPARATOR_CHARACTER = '-'

const blankLine = _ => console.log()

const separator = (n = 100) => console.log(SEPARATOR_CHARACTER.repeat(n))

const warning = str => console.log(c.orange(str))

const info = str => console.log(c.cyan.underline(str))

const error = str => console.log(c.red(str))

const success = str => console.log(c.green(str))

const log = str => console.log(str)

const title = str => console.log(`${c.bold.underline(str)}\n`)

const subtitle = str => console.log(`${c.bgWhite.black.bold(` ${str} `)}\n`)

module.exports = {
  blankLine,
  separator,
  warning,
  info,
  error,
  success,
  log,
  title,
  subtitle
}
