const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

const checksIfRepositoryExists = (request, response, next) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  request.repositoryIndex = repositoryIndex;

  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksIfRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;
  const updatedRepository = request.body;

  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    ...updatedRepository,
    likes: 0
  }

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", checksIfRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksIfRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;
  
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
