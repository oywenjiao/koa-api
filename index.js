'use strict'

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const jsonp = require('koa-jsonp')
const fs = require('fs')
const Model = require('./model')

const app = new Koa()
// 获取body参数
app.use(bodyParser({enableTypes:['json','form','text']}))
// 接收jsonp请求
app.use(jsonp())

// 校验公共参数
app.use(async (ctx, next) => {
    // 获取body参数
    let req = ctx.request.body
    if (!req.v) {
        ctx.body = {code: 406, msg: 'v is required'}
    } else if (!req.method) {
        ctx.body = {code: 406, msg: 'method is required'}
    } else {
        await next()
    }
})

// 通过method参数查找模块
app.use(async (ctx, next) => {
    let req = ctx.request.body
    let methods = req.method.split('.')
    let path = './src/v' + req.v
    // 判断接口版本路径是否存在，不存在时默认请求1.0版本
    let isExists = await getStat(path)
    if (!isExists) {
        path = './src/v1.0'
    }
    // 接口文件当成控制器看待，所以存放路径名称为    `controller`
    path += '/controller/'
    // method参数中的第一个字符串默认为目录名称
    path +=methods[0] + '/'
    // 跟进method参数的切割长度查找js文件前缀
    for (let i = 1; i < methods.length - 1; i++) {
        path += methods[i] + '.'
    }
    path += methods.pop() + '.js'
    // 检查文件是否存在
    if (await getStat(path)) {
        app.context.controller = require(path)
        await next()
    } else {
        ctx.body = {code: 404, msg: req.method + ' not found'}
    }
})

// 检测中间件
app.use(async (ctx, next) => {
    let controller = ctx.controller
    if (controller.middleware) {
        // 接口设置了中间件，所以执行中间件逻辑
        let req = ctx.request.body
        let path = './src/v' + req.v
        // 判断接口版本路径是否存在，不存在时默认请求1.0版本
        let isExists = await getStat(path)
        if (!isExists) {
            path = './src/v1.0'
        }
        path += '/middleware/' + controller.middleware + '.js'
        if (await getStat(path)) {
            let middleware = require(path)
            let result = await middleware.handle(req, ctx.request.headers.authtoken)
            if(result.status === 1){
                await next()
            }else{
                ctx.body = {code:401, msg: result.msg}
            }
        } else {
            ctx.body = {code: 404, msg: controller.middleware + ' not found', response: path}
        }
    } else {
        // 未设置中间件则跳过这一步
        await next()
    }
})

// 必传参数校验
app.use(async (ctx, next) => {
    let controller = ctx.controller
    if (controller.hasOwnProperty('schema') && controller.schema !== false) {
        const Joi = require('@hapi/joi')
        let schema = await controller.schema(Joi)
        try {
            let validate = {...ctx.request.body};
            delete validate.v
            delete validate.method
            delete validate.authtoken
            app.context.joi = await schema.validateAsync(validate)
            await next()
        } catch (err) {
            console.log('aaa error', err)
            ctx.body = {
                code: 406,
                msg: err.hasOwnProperty('details') ? err.details[0]['message'] : err,
                response: 'aaa'
            }
        }
    } else {
        await next()
    }
})

// 执行接口逻辑
app.use(async ctx => {
    let controller = ctx.controller
    if (controller.hasOwnProperty('response')) {
        // 合并数据
        let params = {...ctx.joi, ...ctx.request.body}
        let result = await controller.response(params, await Model())
        if (result.hasOwnProperty('error')) {
            ctx.body = {code: 406, msg: result.error, response: result}
        } else {
            ctx.body = {code: 200, msg: 'success', response: result}
        }
    } else {
        ctx.body = {code: 404, msg: 'method is not :' + ctx.request.body.method}
    }
})

// 检测文件或文件夹是否存在
function getStat(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                resolve(false)
            } else {
                resolve(stats);
            }
        })
    })
}

app.listen(3000)