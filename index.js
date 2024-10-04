// tunnel first: flyctl proxy 5432 -a fso-blogs-relational

require('dotenv').config();
const { Sequelize, QueryTypes, Model, DataTypes } = require('sequelize');
const express = require('express')
const app = express ()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true, 
      rejectUnauthorized: false
    }
  }
}
);

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER, 
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING,
    require: true
  },
  title: {
    type: DataTypes.STRING,
    require: true
  },
  likes: {
    types: DataTypes.INTEGER,
    defaultValue: 0
  }
})

Blog.sync()


app.use(express.json)

app.get('/api/blogs', async(req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs) 
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`)
})