Before using any database, you should first create a user:

> docker exec -it <db_container_hash> /bin/sh

> mongosh --username root --password password123

> use admin

> db.createUser({
  user: "<your_name>",
  pwd: "<your_password>",
  roles: [
    { role: "root", db: "admin" }
  ]
})

Example:

db.createUser({
  user: "kostya",
  pwd: "password123",
  roles: [
    { role: "root", db: "admin" }
  ]
})

Keep in mind that <your_name> and <your_password> should match the credentials in the connection string:
mongodb://kostya:password123@mongodb:27017/products?authSource=admin