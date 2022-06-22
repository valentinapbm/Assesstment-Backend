const {connect} =require("./db")
const app = require("./app")

const port = process.env.PORT || 8000;
connect();

app.listen(port, () => {
    console.log(`Port: ${port} listening`);
    });
