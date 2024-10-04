// tunnel first: flyctl proxy 5432 -a fso-blogs-relational

const express = require('express');
const app = express();

const { PORT } = require('./utils/configs');
const { connectToDatabase } = require('./utils/db');
const blogsRouter = require('./controllers/blogs');
const { logger, errorHandler } = require('./utils/middleware');

app.use(express.json());
app.use(logger);
app.use('/api/blogs', blogsRouter);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
  });
};

start();
