const Hapi = require('hapi');
const Inert = require('inert');
const Handlebars = require('handlebars');
const Vision = require('vision');
const h2o2 = require('h2o2');
const Hoek = require('hoek');
const pg = require('./pg');
const Promise = require("bluebird");
const Basic = require('hapi-auth-basic');

// Create a server with a host and port
const server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 8000,
    labels: ['website']
});

server.register([Inert, Vision, h2o2, Basic], (err) => {
    Hoek.assert(!err, err);

  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: 'views',
  });
});

function validate(request, username, password, cb) {
    if(username === 'AOH' && password === 'onBestEver') {
        cb(null, true, { id: username, name: username });
    }
    else {
        return cb(null, false);
    }
}


server.auth.strategy('simple', 'basic', { validateFunc: validate });


server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {

        reply.view('index', {});
    }
});

server.route({
    method: 'POST',
    path:'/location',
    config: {
        handler: function (request, reply) {
            pg.query('INSERT INTO user_location (location) VALUES $1', [request.param.location]);
        }
    }
    
});


server.route({
    method: 'GET',
    path:'/get_messages',
    config: {
        handler: function (request, reply) {
            var time = request.params.time;
            if (time) {
                pg.query('SELECT location, message FROM message WHERE time > $1 ORDER BY time', [time, amount])
                .then((results) => {
                    reply(results.rows);
                });
            } else {
                reply("Need to specify ?time=<UNIX-timestamp>");
            }
        }
    }
    
});


server.route({
    method: 'GET',
    path:'/admin',
    config: {
        auth: 'simple',
        handler: function (request, reply) {
            reply.view('admin', {});
        }
    }
});



server.route({
    method: 'POST',
    path:'/admin/location_message',
    config: {
        auth: 'simple',
        handler: function (request, reply) {
            pg.query('INSERT INTO message (location, message) VALUES $1, $2;', [request.param.location, request.param.message]);
        }
    }
    
});

server.route({
    method: 'GET',
    path:'/admin/get_location',
    config: {
        auth: 'simple',
        handler: function (request, reply) {
            var amount = request.params.amount || 10;
            var time = request.params.time;
            if (time) {
                pg.query('SELECT location FROM user_location WHERE time > $1 ORDER BY time LIMIT $2', [time, amount])
                .then((results) => {
                    reply(results.rows);
                });
            }
            else {
                pg.query('SELECT location FROM user_location ORDER BY time LIMIT $1', [amount])
                .then((results) => {
                    reply(results.rows);
                })
            }
        }
    }
    
});


server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
        directory: {
            path: 'src/static'
        }
    }
});


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.select('website').info.uri);
});