// tunnel first: flyctl proxy 5432 -a fso-blogs-relational

const express = require('express');
const app = express();

const { PORT } = require('./utils/configs');
const { connectToDatabase } = require('./utils/db');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const readingListsRouter = require('./controllers/readingLists');

const { logger, errorHandler } = require('./utils/middleware');

app.use(express.json());
app.use(logger);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/readinglists', readingListsRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
  });
};

start();
