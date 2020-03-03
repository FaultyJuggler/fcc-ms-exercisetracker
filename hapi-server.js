const Hapi = require( '@hapi/hapi' );
const Mongoose = require( 'mongoose' );
const Joi = require( '@hapi/joi' );

const server = new Hapi.Server( {
  host: 'localhost',
  port: process.env.PORT || 3000,
} );

server.route( {
  path: '/api/exercise',
  handler: '',
} );