# WHAT
This is a HTTP REST API to handle the MiNi orders requests.

# INSTALL
```sh
git clone git@github.com:thotino/api-mini.git
cd api-mini
npm install
```
# USE
## START
Launch the server with this command :
```sh
npm start
```
This server is listening on port 1200.

## REQUESTS
### ENDPOINTS
* `/user` to create a new user with a `POST` request
* `/order` to create a new order of MiNis.

### HEADERS
Use these headers in all your requests:
```json
{
    "Accept": "application/json",
    "Content-Type": "application/json"
}
```

<!-- * Launch the RabbitMQ Server with Docker:
```sh
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
``` -->
