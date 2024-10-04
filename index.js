// tunnel first: flyctl proxy 5432 -a fso-blogs-relational

require('dotenv').config();
const { Sequelize, Model, DataTypes } = require('sequelize');
const express = require('express');
const app = express();

console.log(process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      require: true,
    },
    title: {
      type: DataTypes.STRING,
      require: true,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true, // table names are derived from model names as plural snake case versions
    timestamps: false,
    modelName: 'blog',
  }
);

Blog.sync();

app.use(express.json());

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    return res.json(blog);
  } else {
    return res.status(404).json({ msg: 'blog not found' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    try {
      Blog.destroy({ where: { id: req.params.id } });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    if (blog) {
      return res.json(blog);
    }
  } catch (error) {
    return res.status(404).json({ error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
