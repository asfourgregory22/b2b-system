require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const express = require("express");
const DB = require("./database").connectDB;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req , res) => {
    res.send('API is running'  ); 
});

(async () => {
    await DB();
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
})();