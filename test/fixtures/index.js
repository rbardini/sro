import fs from 'fs'
import path from 'path'
import request from 'request'
import sinon from 'sinon'

const stubRequest = (type, callback) => {
  const file = path.join(__dirname, `data/${type}.xml`)

  fs.readFile(file, (err, data) => {
    if (err) return callback(err)

    const stub = sinon.stub(request, 'post').yields(null, null, data)
    if (callback) callback(null, stub)
  })
}

const restoreRequest = (callback) => {
  request.post.restore()
  if (callback) callback()
}

export { stubRequest, restoreRequest }
