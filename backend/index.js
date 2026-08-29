require('dotenv').config();
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
/*const customerRoutes = require ("./routes/customerRoutes");*/
const orderRoutes = require('./routes/orderRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const express = require("express");
const DB = require("./database").connectDB;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.get('/test', (req, res) => {
    res.json({ message: 'Test OK' });
});

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
/*app.use("/api/customers", customerRoutes);*/
app.use('/api/orders', orderRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req , res) => {
    res.send('API is running'  ); 
});

(async () => {
    await DB();
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
})();