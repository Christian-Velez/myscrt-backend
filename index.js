
// .env
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());



// Mongo
require('./mongo');

// Routers
const userRouter = require('./controllers/user');
const notFound = require('./notFound');
const postRouter = require('./controllers/post');



const PORT = process.env.PORT || 3005;




app.get('/', (req, resp) => {
   resp.send('<h1> app</h1>');
});



app.use('/api/user', userRouter);
app.use('/api/post', postRouter);



// Middleware
// Controlar rutas que no existen
// Cuando llega aqui, ya ha analizado todo y nada coincidio, por lo tanto ejecuto
app.use(notFound);


app.listen(PORT, () => {
   console.log('App running on port', PORT);
});