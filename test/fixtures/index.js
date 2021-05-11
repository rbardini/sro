import fs from 'node:fs'
import request from 'request'
import sinon from 'sinon'

const stubRequest = (type) => {
  const file = new URL(`data/${type}.xml`, import.meta.url)
  const data = fs.readFileSync(file)

  return sinon.stub(request, 'post').yields(null, null, data)
}

const restoreRequest = () => request.post.restore()

export { stubRequest, restoreRequest }
