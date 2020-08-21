const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4")

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateRepoId(request, response, next) {
  const { id } = request.params

  if( !isUuid(id) ) {
    return response.status(400).json({ error: 'Invalid repo ID' })
  }

  return next()
}

app.use( "/repositories/:id", validateRepoId );


app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  console.log(title);
  console.log(url);
  console.log(techs);

  const repo = { id: uuid(), title, url, techs, likes: '0' }
  repositories.push(repo)

  return response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex( repo => repo.id == id);
  if( repoIndex < 0 ) {
    return response.status(400).json({error: "Repo not found"})
  }

  repositories.splice( repoIndex, 1 )
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;