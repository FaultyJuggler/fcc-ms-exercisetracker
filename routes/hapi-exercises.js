'use strict';

const Users = require( '../models/user' );
const Exercises = require( '../models/exercise' );

exports.plugin = {
  pkg: require( '../package.json' ),
  name: 'exercise_routes',
  register: async( server, options ) =>
  {
    const basePath = '/api/exercise/';
    server.route( [
      {
        method: 'POST',
        path: basePath + 'new-user',
        handler: async( req, h ) =>
        {

          try
          {
            const newUser = new Users( req.payload );
            await newUser.save();
            return newUser;
            // const res = h.response( newUser )
            // res.code( 201 )
            // res.header('Content-Type', 'application/json')
            //
            // return res
          } catch( e )
          {
            console.log( e );
            return h.response( e ).code( 400 );
          }
        },
      },
    ] );

    server.route( [
      {
        method: 'GET',
        path: basePath + 'users',
        handler: async( req, h ) =>
        {

          try
          {
            const users = await Users.find().select( '-_id -__v' );
            return users;
            // const res = h.response( users )
            // res.code( 201 )
            // return res
          } catch( e )
          {
            console.log( e );
            return h.response( e ).code( 400 );
          }
        },
      },
    ] );

    server.route( [
      {
        method: 'POST',
        path: basePath + 'add',
        handler: async( req, h ) =>
        {

          try
          {
            const userExists = await Users.exists( {_id: req.payload.userId} );
            if( userExists )
            {
              const newExercise = new Exercises( req.payload );
              if( req.payload.date.length < 1 )
              {
                newExercise.date = new Date();
              }
              await newExercise.save();

              return newExercise;
              // const res = h.response( newExercise )
              // res.code( 201 )
              // res.header('Content-Type', 'application/json')
              //
              // return res
            } else
            {
              throw 'userId does not exist';
              // res.status(404).send('userId does not exist')
            }
          } catch( e )
          {
            console.log( e );
            return h.response( e ).code( 400 );
          }
        },
      },
    ] );

    server.route( [
      {
        method: 'GET',
        path: basePath + 'log',
        handler: async( req, h ) =>
        {

          try
          {
            const userId = req.query.userid;
            const from = req.query.from || '2019';
            const to = req.query.to || new Date();
            const qLimit = req.query.limit || 100;

            const user = ( await Users.findOne( {_id: userId} ) ).toJSON();

            if( user )
            {
              const exQueryObj = {
                userId: userId,
                date: {'$gte': from, '$lte': to},
              };

              const exercises = await Exercises.find( exQueryObj ).
                  limit( qLimit ).
                  select( '-userId -__v -_id' );

              user.count = exercises.length;
              user.exercises = exercises;

              return user;
              // const res = h.response( user )
              // res.code( 201 )
              // res.header('Content-Type', 'application/json')
              // return res
            } else
            {
              const res = h.response( 'user not found' );
              res.code( 404 );
              return res;
            }
          } catch( e )
          {
            console.log( e );
            return h.response( e ).code( 400 );
          }
        },
      },
    ] );
  },
};