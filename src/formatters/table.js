import _ from 'lodash'
import moment from 'moment'
import chalk from 'chalk'
import Table from 'cli-table'

const SYMBOLS = { pass: '✓', fail: '✖' }

const TableFormatter = {
  format: (items, failures) => {
    var formattedItems = _.reduce(items, (result, item) => {
      var header = '\n ' + chalk.bold(item.get('numero')) + '\n ' + item.countryName() + ' via ' + item.service()
      var table = new Table({
        head: ['Data', 'Local', 'Situação']
      })

      item.events().forEach((event) => {
        var data = moment(event.date()).format('lll')
        var local = `${event.get('local')} - ${event.get('cidade')}/${event.get('uf')}`
        var descricao = event.get('descricao')
        var destino = event.get('destino')

        if (destino) {
          local += `\nEm trânsito para ${destino.local} - ${destino.cidade}/${destino.uf}`
        }

        table.push([data, local, descricao])
      })

      return `${result}${header}\n${table.toString()}\n`
    }, '')

    var formattedFailures = _.reduce(failures, (result, failure) => (
      `${result}\n ${chalk.bold(failure.numero)}\n ${chalk.red(`${SYMBOLS.fail} ${failure.error}\n`)}`
    ), '')

    return formattedItems + formattedFailures
  }
}

export default TableFormatter
