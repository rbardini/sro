import chalk from 'chalk'
import Table from 'cli-table'

const SYMBOLS = { pass: '✓', fail: '✖' }

export default (items = [], failures = []) => {
  const formattedItems = items.reduce((result, item) => {
    const header =
      '\n ' + chalk.bold(item.numero) + '\n ' + item.pais + ' via ' + item.nome
    const table = new Table({
      head: ['Data', 'Local', 'Situação']
    })

    item.eventos.forEach(event => {
      const data = new Date(event.data).toLocaleString()
      const city = [event.cidade, event.uf].filter(Boolean).join('/')
      let local = [event.local, city].filter(Boolean).join(' - ')
      const descricao = event.descricao
      const destino = event.destino

      if (destino) {
        local += `\nEm trânsito para ${destino.local} - ${destino.cidade}/${destino.uf}`
      }

      table.push([data, local, descricao])
    })

    return `${result}${header}\n${table.toString()}\n`
  }, '')

  const formattedFailures = failures.reduce(
    (result, failure) =>
      `${result}\n ${chalk.bold(failure.numero)}\n ${chalk.red(
        `${SYMBOLS.fail} ${failure.error}\n`
      )}`,
    ''
  )

  return formattedItems + formattedFailures
}
