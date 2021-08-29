const express = require("express");
const app = express();
const morgan = require('morgan');
const postBank = require('./postBank');
// const path = require('path');
// var serveStatic = require('serve-static')


app.use(morgan('dev'));



const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
  
});
app.set('PORT', process.env.PORT || {PORT});
app.use(express.static('public'));

app.get('/', ( req, res) => {

  const posts = postBank.list();

  const html = 
  `<!DOCTYPE html>
  <html>
  <head>
    <title>The Daily Planet </title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/dailyplanet.jpg"/>The Daily Planet</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">
            ${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
 

  res.send(html)
});

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404)
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>The Daily Planet</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/dailyplanet.jpg"/>The Daily Planet</header>
      <div class="not-found">
        <p>its a 🐦  its a ✈️  its-- nothing... there is nothing here.</p>
      </div>
    </body>
    </html>`
    res.send(html)
  } else {
  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
    <title>The Daily Planet </title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/dailyplanet.jpg"/>The Daily Planet</header>
      <div class='news-item'>
      <p>
        <span class="news-position">${post.id}. ▲</span>${post.title}
        <small>(by ${post.name})</small>
      </p>
      <small class="news-info">
        ${post.upvotes} upvotes | ${post.date}
      </small>
      <p>
      ${post.content}
      </p>
    </div>
    </div>
  </body>
</html>`);
}})
