# Projet Projet Web Dev - Partie Backend -

## Création du projet

```
npx djinit nodejs-postgres-restful-api-db
cd nodejs-postgre-restful-api-db
yarn add express body-parser sequelize pg pg-hstore
```

## Connexion à postgresql

```
sudo service postgresql start
psql -d postgres -U db_user
mdp = "strongpassword123"
```

## Création de la base de données db_todo

```
CREATE DATABASE db_todo;
```

## Connexion et consultation de la base de données

```
\c db_todo
\dt
```

## Lancement du server

```
node ./src/api-server.js
```

## Vérification de la création des tables au lancement du server

```
SELECT * FROM users;

SELECT * FROM todos;

DROP TABLE users, todos;
```
