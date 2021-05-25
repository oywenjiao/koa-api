'use strict'


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

exports.response = async (Req, M) => {
    try {
        const model = new M('user')
        let user = await model.findOne({
            where: {
                phone: Req.phone
            },
            attributes: ['id', 'phone', 'password']
        })
        if (user === null) {
            return {error: '用户名错误!'}
        }
        // 验证密码是否正确
        let pwd = global.HELPER.md5(Req.password)
        if (pwd !== user.password) {
            return {error: '密码错误!'}
        }
        let token = global.HELPER.jwtSign({
            'user_id': user.id
        })
        return {token}
    } catch (err) {
        return {error: err}
    }
}