## Express

### migration
```
sequelize-cli model:generate --name user --attributes email:string,name:string,password:string
sequelize-cli db:migrate
```