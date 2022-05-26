import normalizeEvent from './normalizeEvent.js'

const regionNames = new Intl.DisplayNames(['pt-BR'], { type: 'region' })

const normalizeItem = ({ evento, numero, ...restItem }) => {
  const countryCode = numero.slice(-2)

  return {
    numero,
    pais: regionNames.of(countryCode).toUpperCase(),
    eventos: [evento].flat().filter(Boolean).map(normalizeEvent),
    ...restItem
  }
}

export default normalizeItem
