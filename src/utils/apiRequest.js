import fetch from 'node-fetch'
import xml2js from 'xml2js'

export const REQUEST_HOST = 'http://webservice.correios.com.br'
export const REQUEST_PATH = '/service/rastro'
export const REQUEST_HEADERS = {
  'Content-Type': 'text/xml; charset=utf-8',
  SOAPAction: 'http://resource.webservice.correios.com.br/buscaEventos'
}
export const DEFAULT_OPTIONS = {
  usuario: 'ECT',
  senha: 'SRO',
  tipo: 'L',
  resultado: 'T',
  lingua: '101'
}

const buildEnvelope = ({ usuario, senha, tipo, resultado, lingua, objetos }) =>
  `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:res="http://resource.webservice.correios.com.br/">
    <soap:Body>
      <res:buscaEventosLista>
        <usuario>${usuario}</usuario>
        <senha>${senha}</senha>
        <tipo>${tipo}</tipo>
        <resultado>${resultado}</resultado>
        <lingua>${lingua}</lingua>
        ${objetos.reduce(
          (result, objeto) => `${result}<objetos>${objeto}</objetos>`,
          ''
        )}
      </res:buscaEventosLista>
    </soap:Body>
  </soap:Envelope>`

const apiRequest = async options => {
  const response = await fetch([REQUEST_HOST, REQUEST_PATH].join(''), {
    method: 'POST',
    headers: REQUEST_HEADERS,
    body: buildEnvelope({ ...DEFAULT_OPTIONS, ...options })
  })
  const xmlStr = await response.text()
  const json = await xml2js.parseStringPromise(xmlStr, {
    async: true,
    emptyTag: null,
    explicitArray: false,
    explicitRoot: false,
    ignoreAttrs: true,
    normalize: true,
    normalizeTags: true,
    trim: true,
    tagNameProcessors: [name => name.substr(name.indexOf(':') + 1)]
  })

  return json.body.buscaeventoslistaresponse.return
}

export default apiRequest
