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

server.register([Inert, Vision, h2o2], (err) => {
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
        callback(null, true, { id: username, name: username });
    }
    else {
        return callback(null, false);
    }
}

server.state('user_id', {
    ttl: null,
    path: '/',
    isSecure: false,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: false // don't allow violations of RFC 6265
});

server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {

        reply.view('index', {});
    }
});

server.route({
    method: 'GET',
    path:'/admin',
    handler: function (request, reply) {
        var user_id = request.state.user_id;
        if (!user_id) {
            reply.view('admin_login', {});
        }
        pg.query('SELECT * FROM admin WHERE user_id=$1', user_id)
        .then((results) => {
            if(results.rows.length > 0) {
                reply.view('admin', {});
            } else {
                reply('403');
            }
        })
    }
});

server.route({
    method: 'POST',
    path:'/admin/login',
    handler: function (request, reply) {
        var user_id = request.state.user_id;
        if (!user_id) {
            if (request.params.user_name==="AOH" && request.params.password==="onBestEver") {
                var user_id = uuid.v4();
                reply.redirect('/admin').state('user_id', user_id);
            }
            else {
                reply.redirect('/admin')
            }
        }
        else {
            reply.redirect('/admin')
        }
    }
});

server.route({
    method: 'POST',
    path:'/admin/location_message',
    handler: function (request, reply) {
        var user_id = request.state.user_id;
        if (user_id) {
            pg.query('INSERT INTO message (location, message) VALUES $1, $2;');            
        }
    }
});


server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
        directory: {
            path: 'server/assets'
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