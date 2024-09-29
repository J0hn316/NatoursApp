const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const PORT = 3000 || process.env.PORT;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Video 123 Catching Uncaught Exceptions
// I put code from video into a function.
const handleUncaughtExceptions = () => {
  process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

// Video 122 Errors Outside Express: Unhandled Rejections
// I put code from video into a function.
const handleRejection = () => {
  process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

async function dbConnect() {
  await mongoose.connect(DB);
}

dbConnect().then(() => console.log('DB connection successful!'));

const server = app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

handleRejection();
handleUncaughtExceptions();
