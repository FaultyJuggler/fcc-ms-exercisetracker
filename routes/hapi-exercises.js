const Users = require( '../models/user' );
const Exercises = require( '../models/exercise' );
const router = require( 'express' ).Router();

module.exports = router;

router.route( '/new-user' ).post( async( req, res ) =>
{
  try
  {
    const newUser = new Users( req.body );
    await newUser.save();
    res.status( 201 ).send( newUser );
  } catch( e )
  {
    res.status( 400 ).send( e );
  }
} );

router.route( '/users' ).get( async( req, res ) =>
{
  try
  {
    const users = await Users.find().select( '-_id -__v' );
    res.status( 200 ).send( users );
  } catch( e )
  {
    res.status( 400 ).send( e );
  }
} );

router.route( '/add' ).post( async( req, res ) =>
{
  try
  {
    const userExists = await Users.exists( {_id: req.body.userId} );
    if( userExists )
    {
      const newExercise = new Exercises( req.body );
      if( req.body.date.length < 1 )
      {
        newExercise.date = new Date();
      }
      await newExercise.save();
      res.status( 201 ).send( newExercise );
    } else
    {
      throw 'userId does not exist';
      // res.status(404).send('userId does not exist')
    }
  } catch( e )
  {
    res.status( 400 ).send( e );
  }
} );

router.route( '/log' ).get( async( req, res ) =>
{
  const userId = req.query.userid;
  const from = req.query.from || '2019';
  const to = req.query.to || new Date();
  const qLimit = req.query.limit || 100;

  console.log( userId );

  try
  {
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

      res.send( user );
    } else
    {
      throw 'userId does not exist';
      // res.status(404).send('userId does not exist')
    }
  } catch( e )
  {
    res.status( 400 ).send( e );
  }
} );