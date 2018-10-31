### Create database config
    cp database.dist.json database.json
### Create env config    
    cp .env.dist .env
### Make migrations 
    #if database doesn't exist 
    #./node_modules/.bin/sequelize db:create
    ./node_modules/.bin/sequelize db:migrate