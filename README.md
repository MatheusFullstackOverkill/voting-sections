# Voting Sections

FullStack web application for managing voting sections.

## 💻 Technologies

![Golang](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-000?style=for-the-badge&logo=postgresql)

## 🚀 Setup

- Install Docker and Docker Compose, If you don't already have them installed

- Clone the repository

    ```
    git clone https://github.com/MatheusFullstackOverkill/voting-sections
    ```

- Run the docker-compose file with the command:

    ```
    cd voting-sections && docker-compose up
    ```

- Access the website on the URL http://127.0.0.1:3000

## Technical Debt

Regarding using Redux for topic status, I didn't think it was necessary,
since I don't pass this information between components, and whenever the user accesses the topic screens,
I retrieve the most up-to-date data from the API.