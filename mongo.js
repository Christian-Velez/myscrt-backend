


const mongoose = require('mongoose');
const connectionString = process.env.MONGO_DB_CLUSTER;

mongoose.connect(connectionString)
   .then(() => console.log('Database connected'))
   .catch(console.log);