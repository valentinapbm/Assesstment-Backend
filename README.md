# FAVS API 📑
Develop the API's initial version for Favs company, in which we can make requests to create, update and delete for users, list of favorites and favorites items.

### Before starting 🚨
→ Since we are using Node.js for the API, Node must be installed globally to run the server locally.
 ## 
→ In this API we are using the next external dependencies: 
* database: mongoose
* configuration: cors, dotenv, express & morgan
* token and encryption: bcryptjs & jsonwebtoken. 
 ## 
For making the requests is necessary a tool like postman, insonmia, etc. 

## Install ⚙️
→ Clone this repository to run the API with the following command:
```
git clone https://github.com/valentinapbm/Assesstment-Backend.git
```
→Then use the next comand to install all the external dependencies
```
npm install
```
## Run the App ⚙️
→ Use the next comand to run the App
```
npm start
```
## Run the tests ⚙️
→ Use the next comand to run the test
```
npm run test
or
npm run test:coverage
```
# Endpoints 📍
All the routes have authorization.

`USERS`
Route         | HTTP Verb| Route Middleware        |Description
------------- | -------------| -------------|-------------
http://localhost:8000/users/singup  | POST |  | Create an user
http://localhost:8000/users/login  | POST |  | Login user by email/password
http://localhost:8000/users/getuser  | GET |Authenticated  | Get user by Id
http://localhost:8000/users/delete | DELETE | Authenticated  | Delete User
http://localhost:8000/users/update | PUT |Authenticated  | Update User

`LISTS`
Route         | HTTP Verb| Route Middleware        |Description
------------- | -------------| -------------|-------------
http://localhost:8000/lists/lists  | GET |Authenticated  | Get all list
http://localhost:8000/lists/lists/:listId  | GET |Authenticated  | Get a single list
http://localhost:8000/lists  | POST |Authenticated  | Create a new list
http://localhost:8000/lists/delete/:listId | DELETE | Authenticated  | Delete List
http://localhost:8000/lists/update/:listId | PUT |Authenticated  | Update list

`FAVS`
Route         | HTTP Verb| Route Middleware        |Description
------------- | -------------| -------------|-------------
http://localhost:8000/favs/list  | GET |Authenticated  | Get all favs
http://localhost:8000/favs/:favId  | GET |Authenticated  | Get a single fav
http://localhost:8000/favs/:listId | POST |Authenticated  | Create a new fav
http://localhost:8000/favs/delete/:favId | DELETE | Authenticated  | Delete Fav
http://localhost:8000/favs/update/:favId | PUT |Authenticated  | Update fav

