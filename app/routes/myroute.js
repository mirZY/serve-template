const jwt = require('jsonwebtoken')
const constant = require('../util/constant')
const express = require('express')
const userCtrl = require('../controllers/userctrl')
const logger = require('../util/logger')

const router = express.Router(); //使用express框架自带的路由 类比vue-router
var myroute = (app) => {
    router.route('/user/login').post(userCtrl.login);// 查询登录
    router.route('/user/query').get(userCtrl.query); //查询
    router.route('/user/list').get(userCtrl.list); //列表
    router.route('/user/create').post(userCtrl.createUser);//添加
    router.route('/user/update').post(userCtrl.updateUser);//修改
    router.route('/user/delete/:id').post(userCtrl.deleteUser);//删除
    router.route('/user/list-page').post(userCtrl.listPage);//分页

    //权限
    let checkPermission = (req, res, next)=>{
        logger.info("权限检查。。。")
        //若是跨域请求  首先会有一个试探请求 OPTIONS
        if (req.method === 'OPTIONS'){
            res.send({"msg":"ok"})
        } else if (req.originalUrl === '/api/user/login'){//登录不限制
            next();
        } else if (req.headers.hasOwnProperty('token')){
            //验证token
            logger.info("token 验证", req.headers.token)
            //验证 合法  有效
            jwt.verify(req.headers.token, constant.secret, function(err, decoded){
                if (err) {
                    //logger.error(err); //无效  刚过期(刷新token)
                    if (err.name === 'TokenExpiredError') { //过期
                        logger.error('token过期');
                        // 得到过期时间  若半小时以内 可以刷新token 即不需要重登录
                        let time = ((new Date().getTime()-err.expiredAt.getTime())/(1000*60)).toFixed(2)
                        if (time<=30){
                            logger.info('生成新的token返回前端'); //与登录一样 前端要用新token
                            //根据code返回新token,前端拿到新token再次发请求
                            // 也可以不发送token 
                            res.send({"code":"10001", "token":"xxxxxx"});
                        }
                    }else if (err.name === 'JsonWebTokenError'){
                        logger.error('token无效');
                    }

                } else {
                    logger.info(JSON.stringify(decoded))
                    req.user = decoded; //将解密的数据保存在user属性中
                    next();
                }
            })
        } else {
            logger.info("没有token，无效请求")
            res.send({"msg":"没有token，无效请求"})
        }
    }
    app.use(checkPermission)

    //把路由配置在myexpress实例上
    app.use('/api', router);
}
module.exports = myroute