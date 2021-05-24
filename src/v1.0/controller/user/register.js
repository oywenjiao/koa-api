'use static'

// 中间件
exports.middleware = false

// 参数校验
exports.schema = async Joi => {
    return Joi.object({
        phone: Joi.string()
            .pattern(new RegExp('^1[3456789]\\d{9}$'))
            .required().error(errors => {
                errors.forEach(err => {
                    if (err.code === 'string.pattern.base') {
                        err.message = '请输入正确的手机号'
                    } else {
                        err.message = '手机号不能为空'
                    }
                })
                return errors
            }),
        password: Joi.string().required().error(errors => {
            errors.forEach(err => err.message = '请输入密码')
            return errors
        })
    })
}

// 处理逻辑
exports.response = async (Req, M) => {
    try {
        const model = new M('user')
        console.log(model)
        model.create({
            phone: Req.phone,
            password: Req.password,
            create_time: 123243234
        })
        return Req
    } catch (err) {
        return {error: err}
    }
}