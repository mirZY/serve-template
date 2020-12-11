//导入依赖包

var express = require('./config/myexpress')
var config = require('./config/config')

const server = express();

//启动服务
server.listenAsync(config.port).then(()=>{
    console.log("Server started on port 3000.")
})