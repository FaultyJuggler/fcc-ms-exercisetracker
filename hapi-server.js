// external
const Hapi = require( '@hapi/hapi' );
const Mongoose = require( 'mongoose' );
const inert = require( '@hapi/inert' );
const getSecret = require( 'docker-secret' ).getSecret;
// internal

Mongoose.connect(
    getSecret( 'MONGO_URI' ) || process.env.MONGO_URI,
    {useNewUrlParser: true, useUnifiedTopology: true} );

const startWithPlugins = async function()
{
  const server = new Hapi.Server( {
    host: 'localhost',
    port: process.env.PORT || 3000,
  } );

  // server.connection({ routes: { cors: true } })

  console.log( 'server defined' );

  await server.register( inert );
  // server.register(Vision, function (err) {
  //   if (err) {
  //     console.log('Cannot register vision')
  //   }

  // configure template support
  //   server.views({
  //     engines: {
  //       html: Handlebars
  //     },
  //     path: __dirname + '/views',
  //     layout: 'layout'
  //   })
  // })
  //
  // console.log( 'views added' )

  server.route( {
    method: 'GET',
    path: '/',
    handler( req, h )
    {
      return h.file( __dirname + '/views/index.html' );
    },
  } );

  console.log( 'near routes initiated' );

  await server.register(
      [{plugin: require( './routes/hapi-exercises' )}],
  );

  console.log( 'plugins registered' );

  try
  {
    await server.start();
  } catch( err )
  {
    console.error( err );
    process.exit( 1 );
  }
  console.log( `Server running at: ${ server.info.uri }` );
};

startWithPlugins();

// exports.server = server;