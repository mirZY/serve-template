const jwt = require('jsonwebtoken')
const constant = require('../util/constant')
const logger = require('../util/logger')
const userService = require('../service/userservice')
const { sequelize } = require('../models')
var operations = {
    //生成token
    generateToken(data) {
        return jwt.sign(data, constant.secret, {
            expiresIn: '60000' //ms 1d---1天
        })
    },
    // 用户登录接口
    login: function (req, res) {
        let {
            account,
            password
        } = req.body;
        logger.info("调用用户登录接口开始" + account + " " + password)
        userService.findUser(account, password)
            .then(data => {
                if (data) {
                    //data中不能有密码
                    let result = {
                        data: data,
                        msg: "用户登录成功",
                        code: 200
                    }
                    let jwt = operations.generateToken(result);
                    console.log(jwt)
                    result.token = jwt;
                    res.status(200).json(result)
                    logger.info("用户登录成功")
                } else {
                    res.status(400).json({
                        "msg": "用户登录失败"
                    })
                    logger.info("用户登录失败")
                }
            })
    },
    //用户查询
    query: function (req, res) {
        logger.info("用户查询开始")
        userService.findUser(req.body.account,req.body.password)
            .then(data => {
                 let result = {
                     data:data,
                     code:200,
                     mes:"查询成功"
                 }
                res.status(200).json(result)
                logger.info("用户查询结束")
            })
    },
    // 用户查询列表接口
    list: function (req, res) { //req--request  res-response
        logger.info("调用用户查询接口")
        
        sequelize.query(`select * from jd_user`,{type:sequelize.QueryTypes.SELECT}).then(jd_user=>{
            let result = {
                data:jd_user,
                msg: "查询成功",
                code: 200
            }
            res.status(200).json(result)
        })
        //给浏览器返回数据
            // let users = [{
            //     name: "小张"
            // }, {
            //     name: "小王"
            // }]
        // res.status(200).send(users)
      
        logger.info("调用用户查询接口结束")
    },
     // 添加用户
    createUser: function(req, res) {
        const user = req.body;
        logger.info("添加用户"+JSON.stringify(user))
        userService.createUser(user)
        .then(data=>{
            res.status(200).json({"msg":"添加用户成功"})
            logger.info("添加用户结束")
        })
        .catch(err=>{
            res.status(400).json({"msg":err})
            logger.info("添加用户异常")
        })
    },
    //修改用户
    updateUser: function(req, res){
        const user = req.body;
        logger.info("修改用户"+JSON.stringify(user))
        userService.updateUser(user)
        .then(data=>{
            res.status(200).json({"msg":"修改用户成功"})
            logger.info("修改用户结束")
        })
        .catch(err=>{
            res.status(400).json({"msg":err})
            logger.info("修改用户异常")
        })
    },
    //删除用户  id参数希望在url最后面 /:id
    deleteUser: function(req, res){
        const userId = req.params.id;
        logger.info("删除用户"+userId)
        userService.deleteUser(userId)
        .then(data=>{
            res.status(200).json({"msg":"删除用户成功"})
            logger.info("删除用户结束")
        })
        .catch(err=>{
            res.status(400).json({"msg":err})
            logger.info("删除用户异常")
        })
    },
    // 分页
    listPage: function(req, res){
        let {pageNo, pageSize, account} = req.body;
        if (pageNo && pageSize) {
            pageNo = pageNo - 1; //页数是从1开始 数据库是从0开始
            userService.findUserByPage(pageNo, pageSize, account)
            .then(data=>{
                res.status(200).json(data)
            })
        }
    },

}
module.exports = operations