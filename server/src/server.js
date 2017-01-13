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
            pg.query('INSERT INTO location (location) VALUES ($1)', [request.payload.location])
            .then(reply("200"));
        }
    }

});


server.route({
    method: 'GET',
    path:'/get_messages',
    config: {
        handler: function (request, reply) {
            var time = request.query.time;
            var amount = request.query.amount;
            var q = 'SELECT location, message, icon, time FROM message';
            if (time) {
                time = new Date(time);
                time.setSeconds(time.getSeconds() + 1);
                time = time.toISOString().replace('T', ' ');
                q = q + " WHERE time > '" + time + "'";
            } if (amount) {
                q = q + ' ORDER BY time DESC LIMIT ' + amount;
            } else {
                 q = q + ' ORDER BY time ASC';
            }
            pg.query(q, [])
            .then((results) => {
                console.log(results.rows.length);
                reply(results.rows);
            }).catch((e) => {console.log(e)});
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
            console.log(request.payload.location)
            pg.query('INSERT INTO message (location, message, icon) VALUES ($1, $2, $3);', [request.payload.location, request.payload.message, request.payload.pokemon]);
            reply();
        }
    }

});

server.route({
    method: 'GET',
    path:'/admin/get_location',
    config: {
        auth: 'simple',
        handler: function (request, reply) {
            var amount = request.query.amount;
            var time = request.query.time;

            var q = 'SELECT location, time FROM location';

            if (time) {
                time = new Date(time);
                time.setSeconds(time.getSeconds() + 1);
                time = time.toISOString().replace('T', ' ');
                q = q + " WHERE time > '" + time + "'";
            }
            q = q + ' ORDER BY time DESC'
            if (amount) {
                q = q + ' LIMIT ' + amount + ';';
            }
             pg.query(q, [])
                .then((results) => {
                    reply(results.rows);
                })
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
