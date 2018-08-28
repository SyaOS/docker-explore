const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const axios = require('axios').default
const mustache = require('mustache')

const app = module.exports = new Koa()
const template = fs.readFileSync(path.resolve(__dirname, 'template.mustache'), 'utf8')

const getRepositories = async (url) => {
  const { results, next } = await axios.get(url).then(response => response.data)
  return results.concat(next != null
    ? await getRepositories(next)
    : [])
}

app.use(async context => {
  context.assert(context.method === 'GET', 405)
  context.assert(context.path === '/', 404)

  const repositories = await getRepositories('https://hub.docker.com/v2/repositories/library')
  repositories.sort((repositoryA, repositoryB) => repositoryB.pull_count - repositoryA.pull_count)

  context.body = { repositories }

  if (context.accepts('html')) {
    context.type = 'html'
    context.body = mustache.render(template, context.body)
  }
})

if (require.main === module) {
  app.listen(process.env.PORT)
}
