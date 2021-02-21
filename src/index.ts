import "reflect-metadata";
import {createConnection, getConnectionOptions} from "typeorm";
import express from 'express'
import session from 'express-session'
// import connectSqlite3 from 'connect-sqlite3'
import { ApolloServer } from 'apollo-server-express'
import * as path from 'path'
import { buildSchema } from 'type-graphql'
import { PlaceResolver } from './res/PlaceResolver'
// var connect = require('connect'),


var SQLiteStore = require('connect-sqlite3')(session);

// const SQLiteStore = connectSqlite3(session)

async function bootstrap() {
    const app = express();

    app.use(
        session({
            store: new SQLiteStore({
                db: 'database.sqlite',
                concurrentDB: true
            }),
            name: 'qid',
            secret: process.env.SESSION_SECRET || "rwerwkjer3",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 12 * 7 * 365
            }
        })
    )

    // get config options from ormconfig.js
    const dbOptions = await getConnectionOptions(
        process.env.NODE_ENV || 'development'
    )


    createConnection({ ...dbOptions, name: 'default' }).then(async () => {
        //1. Build Server Schema
        const schema = await buildSchema({
            resolvers: [PlaceResolver],
            emitSchemaFile: path.resolve(__dirname, 'schema.gql')
        })

        //2. Create Apollo Server instance
        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }) => ({ req, res }),
            introspection: true,
            playground: true,
        })

        //3. Apply server instance as middleware
        apolloServer.applyMiddleware({ app, cors: true })
        const port = process.env.PORT || 4000


        //4. Listen to request  on associated port
        app.listen(port, () => {
                console.log(`Server started at http://localhost:${port}/graphql`)
                
        })

    // console.log("Inserting a new user into the database...");
    // const place = new Place();
    // place.id = 1;
    // place.title = 'New York City';
    // place.description = "The Big Apple";
    // place.imageUrl = "https://picsum.photos/700"
    // place.creationDate = new Date()
    
    // await connection.manager.save(place)
    // const places = await connection.manager.find(Place);
    // console.log("Loaded places: ", places);

    // console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
}

bootstrap();