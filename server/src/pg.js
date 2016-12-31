var pg = require('pg');
const url = require('url');
const params/*: Object*/ = url.parse(process.env.VAIHTO_DATABASE_URL);
const auth = params.auth.split(':');

var pgconfig = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  ssl: true,
};


var pool = new pg.Pool(pgconfig);

module.exports = {
	query(q, opts) {
		return new Promise((resolve, reject) => {
		    pool.query(q, opts, function(err, result) {
		      if (err) {
		        console.error('error running query', err);
		        return reject(err);
		      }
		      return resolve(result);
		    });
		});
	}
}