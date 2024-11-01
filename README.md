<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Task Management API

## 1. Instale as Dependências

```bash
npm install

## 2. Variáveis de Ambiente

PORT=3000

MYSQL_USER="bd-user-notification"
MYSQL_HOST="127.0.0.1"
MYSQL_PASSWORD="task1234"
MYSQL_DATABASE="bd_notification"
MYSQL_PORT="3306"
REDIS_URL="redis://localhost:6379"

## 3. Execute o Docker Compose

docker-compose up -d


## 4. Compilação e Execução

# Desenvolvimento
npm run start

# Modo watch
npm run start:dev

# Produção
npm run start:prod


## 5. Estrutura do Projeto

Task Entity
Task Service
Task Controller
DTOs (CreateTaskDto e UpdateTaskDto)
Notification Processor


## 6. Uso da API

#Criar uma nova tarefa

URL: http://localhost:3003/tasks

POST /tasks > JSON {
  "title": "Estudar NestJS",
  "description": "Aprender sobre módulos e injeção de dependência",
  "userEmail": "usuario@exemplo.com"
}

# Listar todas as tarefas

URL: http://localhost:3003/tasks

GET /tasks

# Marcar uma tarefa como concluída

URL: http://localhost:3003/tasks/1

PUT /tasks/:id

# Excluir uma tarefa

URL: http://localhost:3003/tasks/1

DELETE /tasks/:id


## 7. Testes

# Testes unitários
npm test


## 8. Tecnologias Utilizadas

Tecnologias Utilizadas
NestJS
TypeORM
BullMQ
Docker e Docker Compose









