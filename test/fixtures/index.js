import fs from 'fs'
import request from 'request'
import sinon from 'sinon'

const stubRequest = (type, callback) => {
  var file = `${__dirname}/data/${type}.xml`

  fs.readFile(file, (err, data) => {
    if (err) return callback(err)

    var stub = sinon.stub(request, 'post').yields(null, null, data)
    if (callback) callback(null, stub)
  })
}

const restoreRequest = (callback) => {
  request.post.restore()
  if (callback) callback()
}

export { stubRequest, restoreRequest }
