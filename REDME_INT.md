Before using any database, you should first create a user:

> docker exec -it <db_container_hash> /bin/sh

> mongosh --username root --password password123

> use admin

> db.createUser({
  user: "<your_name>",
  pwd: "<your_password>",
  roles: [
    { role: "readWrite", db: "<db_name, e.g. products>" }
  ]
})

Example:

db.createUser({
  user: "kostya",
  pwd: "password123",
  roles: [
    { role: "readWrite", db: "products" }
  ]
})

Keep in mind that <your_name> and <your_password> should match the credentials in the connection string:

mongodb://kostya:password123@products_db:27017/products?authSource=admin