'use strict';

const Hapi = require('hapi');
const MongoDB = require('hapi-mongodb');
const dbconfig = require('./config/dbconfig');
const inert = require('inert');
const env = process.env;
const Good = require('good');


// Create a server with a host and port
const server = new Hapi.Server();

var routes = require('./routes.js'); //require routes

// var host = env.NODE_IP || 'localhost';
var port = env.PORT || 3001;
var options = dbconfig.config('admin', 'bot3598');

server.connection({
    port: port
});



// Add the route
for (var route in routes) {
    server.route(routes[route]);
}

server.register([{
    register: MongoDB,
    options: options
},{
    register: inert,
    options: {}
}], (err) => {
    if (err) {
        console.error(err);
        throw err;
    }

    //Serving static files
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'dist'
            }
        }
    });

    server.start((err) => console.log('Server started at:', server.info.uri));
});
