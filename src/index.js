const app = require('./app');
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is up and running on Port : ${port}`);
});