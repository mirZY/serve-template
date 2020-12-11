//目录根文件
//将所有的数据模型文件都导出
const fs =require('fs' )  //node文件系统模块
const path =require('path')   //node文件路径模块
const Sequelize =require('sequelize')    //三方
const config =require('../../config/config')   //相对路径--本地
const logger =require('../util/logger') 

const db = {};
const con = config.db;
let sequelize;   //连接数据库

try {
    //连接db
    sequelize = new Sequelize(con.database, con.username, con.password, con);
    logger.info("数据库连接成功")
}catch(e){
    logger.error("数据库连接失败")
    throw e;
}

//找到数据模型文件,以jd_开头的, 排除index.js
fs.readdirSync(__dirname)  //__dirname当前目录
  .filter(f => {
      return f !== 'index.js'
  })
  .forEach(f => {
      //通过sequelize将模型文件导入 f--绝对路径
    //   console.log(f)
      const model = sequelize.import(path.join(__dirname, f))
      db[model.name] = model; // db.jd_user = model
  })

  db.sequelize = sequelize; //把sequelize暴露出去 为了执行sql

module.exports = db;

