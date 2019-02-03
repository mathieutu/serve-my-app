import chalk from 'chalk'
// @ts-ignore
import * as Table from 'cli-table'
import { ExpressEndpoint, ExpressEndpoints } from 'express-list-endpoints'
import { getIn } from './misc'

const methodsColors = {
  OPTIONS: 'grey',
  GET: 'green',
  POST: 'blue',
  PUT: 'yellow',
  PATCH: 'yellow',
  DELETE: 'red',
}

const visibleMethods = Object.keys(methodsColors)

export default (routes: ExpressEndpoints) => {
  const table = new Table({
    // head: [chalk.white('ROUTES'), chalk.white('METHODS')],
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: ' ',
    },
    style: { 'padding-left': 0, 'padding-right': 0, compact: true },
  })

  routes.forEach(route => table.push([`    - ${route.path}:`, prepareMethods(route.methods)]))

  return table.toString()
}

const prepareMethods = (methods: ExpressEndpoint['methods']) => methods
  .filter(method => visibleMethods.includes(method))
  .sort((first, second) => visibleMethods.indexOf(first) - visibleMethods.indexOf(second))
  .map(method => getIn(chalk, getIn(methodsColors, method, 'reset'))(method))
  .join(', ')
