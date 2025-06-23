# Voting Sections

Aplicação Web FullStack para gerenciamento de sessões de votação.

## 💻 Tecnologias

![Golang](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000?style=for-the-badge&logo=postgresql)

## 🚀 Setup

- Instale o Docker e Docker Compose, caso já não os tenha instalados.
- Clonar o repositório.

```
git clone https://github.com/MatheusFullstackOverkill/voting-sections
```

- Executar o arquivo docker-compose com o comando:

```
cd voting-sections && docker-compose up
```

## Dívidas Técnicas

Sobre a utilização de redux para o estado dos tópicos, não julguei nescessário,
pois não passo essas informações entre components e sempre que o usuário acessa as telas de tópicos,
eu busco na API os dados mais atualizados.