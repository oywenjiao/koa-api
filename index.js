'use strict'

const Koa = require('koa')

const app = new Koa()

app.use(async (ctx, next) => {
    ctx.body = 'hello koa api'
})

app.listen(3000)