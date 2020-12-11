const {createLogger, format, transports} = require("winston") //记录日志

//自定义日志格式  添加时间
const myFormat = format.printf(log => {
    return `${log.timestamp} ${log.level}: ${log.message}`
})

//日志级别： info普通 warn error
const logger = createLogger({ //创建日志记录对象
    level: "info",  //指定输出日志级别
    format: format.combine(  //使用组合的方式 给日志加时间
        format.timestamp(),  //时间
        myFormat
    ),
    transports: [
        new transports.Console(), //把日志输出在控制台
        new transports.File({filename: './logs/log.log'})//指定保存的文件  .当前目录
    ]
})
module.exports = logger