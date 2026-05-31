const app = require('./app');
const connectDB = require('./config/db');
const initCronJobs = require('./services/cronService');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Initialize Cron Jobs
initCronJobs();

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
