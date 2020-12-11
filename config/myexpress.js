var express = require('express')
var bodyParser = require('body-parser')
var util = require('util');
var showForm = () =>{
    var app = express();

    // 使用promise方式将app.listen导出到外边
    app.listenAsync = util.promisify(app.listen); //node8.x提供的

     //跨域处理
     var allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
        next();
    };
    app.use(allowCrossDomain);
    app.use(bodyParser.json()); //解析前端发送的json数据
    app.use(bodyParser.urlencoded({extended: true})); //解析前端发表单数据

    //把user.route.js关联到app实例上
    require(process.cwd() + '/app/routes/myroute.js')(app)

    //启动服务
    return app; //返回promise

}  

module.exports = showForm