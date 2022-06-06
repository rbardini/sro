import fs from 'node:fs'
import nock from 'nock'
import { REQUEST_HOST, REQUEST_PATH } from '../../src/utils/apiRequest.js'

export const mockRequests = type => {
  const file = new URL(`data/${type}.xml`, import.meta.url)
  const data = fs.readFileSync(file)

  return nock(REQUEST_HOST).post(REQUEST_PATH).reply(200, data)
}

export const restoreRequests = () => nock.cleanAll()
