node项目拆分成以下几块
main.js 项目入口
app(路由 控制器 服务层 建模 盐 日志)
》======
routes 路由 前端接口
controllers 控制器 接口逻辑
service 服务层 处理数据库和接口逻辑
util 日志和盐
models建模

config 配置端口 连接数据库(mysql)
db 创建 建模
logs 输出日志
sequelize-modal.sh 脚本

插件
express
body-parser
mysql
mysql2
sequelize 建模
jsonwebtoken jwt
winston 日志 
如果脚步跑脚步不成功 使用以下方法
1.mdkir db
2.npx sequelize init
3.sequelize-auto -o ./app/models -d ${DB} -h ${HOST} -u ${USER} -p ${PORT} -x ${PASS} -e mysql
HOST="127.0.0.1"
DB="" 数据库名
USER="" 账户
PASS="" 密码
PORT="3306" 端口
DIR="./models" 输出地址
修改db config配置数据库信息