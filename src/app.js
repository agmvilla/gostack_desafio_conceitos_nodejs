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

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}  `
  console.time(logLabel)
  next()
  console.timeEnd(logLabel)
}






app.use( "/repositories/:id", validateRepoId );
app.use( "/", logRequest );


app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  console.log(title);
  console.log(url);
  console.log(techs);

  const repo = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(repo)

  return response.json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body

  const repoIndex = repositories.findIndex( repo => repo.id == id);
  if( repoIndex < 0 ) {
    return response.status(400).json({error: "Repo not found"})
  }

  const repo = {
    id: repositories[repoIndex].id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }
  repositories[repoIndex] = repo
  return response.json(repo)
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
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex( repo => repo.id == id);
  if( repoIndex < 0 ) {
    return response.status(400).json({error: "Repo not found"})
  }

  repositories[repoIndex].likes++

  // return response.status(204).send()
  return response.json(repositories[repoIndex])
});

module.exports = app;