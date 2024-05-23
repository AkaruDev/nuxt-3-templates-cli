import colors from 'ansi-colors'
const { orange, cyan, red, green, bold, bgWhite } = colors

const SEPARATOR_CHARACTER = '-'

const blankLine = () => console.log()

const separator = (n = 100) => console.log(SEPARATOR_CHARACTER.repeat(n))

const warning = str => console.log(orange(str))

const info = str => console.log(cyan.underline(str))

const error = str => console.log(red(str))

const success = str => console.log(green(str))

const log = str => console.log(str)

const title = str => console.log(`${bold.underline(str)}\n`)

const subtitle = str => console.log(`${bgWhite.black.bold(` ${str} `)}\n`)

export default {
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
