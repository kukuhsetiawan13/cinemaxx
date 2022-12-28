const errorHandler = (err, req, res, next) => {
    let code = 500
    let message = 'Internal Server Error'
    console.log(err)
  	
    if (err.name === 'SequelizeValidationError') {
      code = 400
      message = err.errors.map(el => el.message)
    }
    else if(err.name === 'SequelizeUniqueConstraintError') {
      code = 400
      message = 'Email has already been registered'
    } 
    else if (err === 'Invalid email' || err === 'Invalid password') {
      code = 401
      message = err
    }
    else if(err === 'Invalid token' || err.name === "JsonWebTokenError") {
      code = 401
      message = 'Invalid Token'
    }
    else if(err === 'Movie not found' || err === 'Genre not found' || err === 'Bookmark not found') {
      code = 404
      message = err
    }
    else if (err === 'Forbidden') {
      code = 403
      message = 'Forbidden'
    } else if (err === 'This movie is already bookmarked') {
      code = 400
      message = err
    }

    res.status(code).json({message})
  }

  module.exports = {errorHandler}
