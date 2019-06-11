/* eslint-env mocha */
const assert = require('assert')

const axiosist = require('axiosist')
const contentType = require('content-type')

const app = require('.')

it('should works', async function () {
  this.slow('20s')
  this.timeout('60s')
  const response = await axiosist(app.callback()).get('/')
  assert.strictEqual(response.status, 200)
  assert.strictEqual(contentType.parse(response.headers['content-type']).type, 'text/html')
})
