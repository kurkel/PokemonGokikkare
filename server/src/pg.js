var pg = require('pg');
const url = require('url');
const params/*: Object*/ = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};


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

const CREATE_GAME = 'INSERT INTO game (hash, owner, state) VALUES ($1, $2, $3)';
const UPDATE_GAME = 'UPDATE game SET state=$1 WHERE hash=$2';
const INSERT_BET = 'INSERT INTO bet (name, amount, suit, game) VALUES ($1, $2, $3, $4)';
const GET_GAME = 'SELECT state, owner FROM game WHERE hash=$1';
const GET_BETS = 'SELECT name, amount, suit FROM bet WHERE game=$1';

var pool = new pg.Pool(pgconfig);

module.exports = {
	CREATE_GAME,
	UPDATE_GAME,
	INSERT_BET,
	GET_GAME,
	GET_BETS,
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