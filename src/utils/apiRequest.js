import _ from 'lodash'
import request from 'request'

const REQUEST_URL = 'http://webservice.correios.com.br/service/rastro'
const REQUEST_HEADERS = {
  'Content-Type': 'text/xml; charset=utf-8',
  SOAPAction: 'http://resource.webservice.correios.com.br/buscaEventos'
}
const DEFAULT_OPTIONS = { usuario: 'ECT', senha: 'SRO', tipo: 'L', resultado: 'T', lingua: '101' }

const buildEnvelope = ({ usuario, senha, tipo, resultado, lingua, objetos }) => (
  `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:res="http://resource.webservice.correios.com.br/">
    <soap:Body>
      <res:buscaEventosLista>
        <usuario>${usuario}</usuario>
        <senha>${senha}</senha>
        <tipo>${tipo}</tipo>
        <resultado>${resultado}</resultado>
        <lingua>${lingua}</lingua>
        ${objetos.reduce((result, objeto) => `${result}<objetos>${objeto}</objetos>`, '')}
      </res:buscaEventosLista>
    </soap:Body>
  </soap:Envelope>`
)

const apiRequest = (options, callback) => {
  options = _.defaults({}, options, DEFAULT_OPTIONS)

  return request.post({
    url: REQUEST_URL,
    headers: REQUEST_HEADERS,
    body: buildEnvelope(options)
  }, callback)
}

export default apiRequest
