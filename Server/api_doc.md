## Endpoints

List of Available Endpoints:
- `POST /users/register`
- `POST /users/login`
- `POST /users/google-login`
- `POST /users/pub/register`
- `POST /users/pub/google-login`
- `POST /movies/add`
- `GET /movies`
- `GET /movies/:id`
- `DELETE /movies/delete/:movieId`
- `PUT /movies/edit/:movieId`
- `PATCH /movies/edit-status/:movieId`
- `GET /genres`
- `POST /genres/add`
- `DELETE /genres/delete/:genreId`
- `PUT /genres/edit/:genreId`
- `GET /histories`
- `GET /wishlists/pub`
- `POST /wishlists/pub/addToBookmark/:movieId`
- `POST /wishlists/pub/deleteFromBookmark/:movieId`

&nbsp;

### 1. POST /users/register
#### Description
- Create a new user

#### Request
- Body
    ```json
    {
      "username": String,
      "email": String | required,
      "password": String | required,
      "phoneNumber": String,
      "address": String 
    }
    ```
#### Response
_Response (201 - Created)_

```json
{
  "message": "User with email <email> has just been created"
}
```

_400 - Bad Request_
- Body
    ```json
    {
      "errors": ["Email can not be empty" OR "Email is not valid" OR "Password can not be empty" OR "Password must have at least 5 characters"]
    }
    ```
&nbsp;

### 2. POST /users/login
#### Description
- User's login form

#### Request
- Body
    ```json
    {
      "email": String | required,
      "password": String | required
    }
    ```
#### Response
_200 - Ok
- Body
    ```json
    {
    "acess_token": String,
    "username": String
    }
    ```

_400 - Bad Request_
- Body
    ```json
    {
      "message": "Invalid Email"
    }
    OR
    {
      "message": "Invalid Password"
    }
    ```
&nbsp;


### 3. POST /users/google-login
#### Description
- User's login with google

#### Request
- headers: 

  ```json
  {
    "google-oauth-token": "string"
  }
  ```
#### Response
_200 - OK
- Body
    ```json
    {
    "acess_token": String,
    "username": String
    }
    ```


&nbsp;

### 4. POST /users/pub/register
#### Description
- Create a new customer

#### Request
- Body
    ```json
    {
      "username": String,
      "email": String | required,
      "password": String | required,
      "phoneNumber": String,
      "address": String 
    }
    ```
#### Response
_Response (201 - Created)_

```json
{
  "message": "User with email <email> has just been created"
}
```

_400 - Bad Request_
- Body
    ```json
    {
      "errors": ["Email can not be empty" OR "Email is not valid" OR "Password can not be empty" OR "Password must have at least 5 characters"]
    }
    ```
&nbsp;

### 5. POST /users/pub/google-login
#### Description
- Customer's login with google

#### Request
- headers: 

  ```json
  {
    "google-oauth-token": "string"
  }
  ```
#### Response
_200 - OK
- Body
    ```json
    {
    "acess_token": String,
    "username": String
    }
    ```


&nbsp;

### 6. POST /movies/add
#### Description
- Create a new movie

#### Request
- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```
- Body
    ```json
    {
      "title": String | required,
      "synopsis": String | required,
      "trailerUrl": String,
      "imgUrl": String,
      "rating": Integer | minimum value = 1,
      "genreId": Integer,
    }
    ```
- req.authorization: 

  ```json
  {
    "authorId": "Integer"
  }
  ```
#### Response
_201 - Created
- Body
    ```json
    {
        "id": Integer,
        "title": String,
        "synopsis": String,
        "trailerUrl": String,
        "imgUrl": String,
        "rating": Integer,
        "genreId": Integer,
        "authorId": Integer,
    }
    ```

_400 - Bad Request_
  ```json
    {
      "errors": ["Title can not be empty" OR "Synopsis can not be empty" OR "Minimum rating is 1"]
    }
  ```
&nbsp;

### 7. GET /movies
#### Description
- Get all movies from the database

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

#### Response
_200 - OK_

- Body
    ```json
    [
        {
        "id": 1,
        "title": "Harry Potter and the Chamber of Secrets",
        "synopsis": "An ancient prophecy seems to be coming true when a mysterious presence begins stalking the corridors of a school of magic and leaving its victims paralyzed.",
        "trailerUrl": "https://www.imdb.com/title/tt0295297/",
        "imgUrl": "https://www.imdb.com/title/tt0295297/mediaviewer/rm3790637825/?ref_=tt_ov_i",
        "rating": 7,
        "genreId": 1,
        "authorId": 1,
        "createdAt": "2022-11-14T09:41:21.954Z",
        "updatedAt": "2022-11-14T09:41:21.954Z"
    },
    {
        "id": 2,
        "title": "Top Gun: Maverick",
        "synopsis": "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
        "trailerUrl": "https://www.imdb.com/title/tt1745960/?ref_=nv_sr_srsg_0",
        "imgUrl": "https://www.imdb.com/title/tt1745960/mediaviewer/rm3294367489/?ref_=tt_ov_i",
        "rating": 8,
        "genreId": 1,
        "authorId": 1,
        "createdAt": "2022-11-14T10:30:51.770Z",
        "updatedAt": "2022-11-14T10:30:51.770Z"
    },
    ...,
    ]
    ```



&nbsp;

## 8. GET /movies/find/:movieId

Description:
- Get a movie based on a given id

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```
- params:

  ```json
  {
    "movieId": Integer | required
  }
  ```

_Response (200 - OK)_

  ```json
  {
      "id": Integer,
      "title": String,
      "synopsis": String,
      "trailerUrl": String,
      "imgUrl": String,
      "rating": Integer,
      "genreId": Integer,
      "authorId": Integer,
      "createdAt": Date,
      "updatedAt": Date
  }
  ```

Response (404 - Not Found)_

  ```json
  {
    "message": "Movie not found"
  }
  ```

&nbsp;

## 9. DELETE /movies/delete/:movieId

Description:
- Delete a movie based on a given id

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

- req.userAuthorization:
  ```json
  {
    "role": String,
    "authorId": Integer
  }
  ```


- params:

```json
{
  "id": Integer | required
}
```

_Response (200 - OK)_

```json
{
    "message": "<movie title> has been succesfully deleted"
}
```
_Response (403 - Unauthorized)_

```json
{
  "message": "Forbidden"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Movie not found"
}
```
&nbsp;

## 10. PUT /movies/edit/:movieId

Description:
- Edit a movie based on a given id

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

- req.userAuthorization:
  ```json
  {
    "role": String,
    "authorId": Integer
  }
  ```


- params:

```json
{
  "movieId": Integer | required
}
```

- Body
    ```json
    {
        "id": Integer,
        "title": String,
        "synopsis": String,
        "trailerUrl": String,
        "imgUrl": String,
        "rating": Integer,
        "genreId": Integer,
        "authorId": Integer,
    }
    ```

_Response (200 - OK)_

```json
{
    "message": "Movie with id <movieId> has just been updated"
}
```
_Response (403 - Unauthorized)_

```json
{
  "message": "Forbidden"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Movie not found"
}
```
&nbsp;

## 11. PATCH /movies/edit-status/:movieId

Description:
- Edit a movie's status based on a given id

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

- req.userAuthorization:
  ```json
  {
    "role": String,
    "authorId": Integer
  }
  ```

- params:

```json
{
  "movieId": Integer | required
}
```

- Body
    ```json
    {
        "status": String,
    }
    ```

_Response (200 - OK)_

```json
{
    "message": "<movie title>'s status has been changed to <status>'"
}
```
_Response (403 - Unauthorized)_

```json
{
  "message": "Forbidden"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Movie not found"
}
```
&nbsp;



## 12. GET /genres

Description:
- Get all genres from the database

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

_Response (200 - OK)_

  ```json
  [
      {
          "id": 1,
          "name": "fantasy",
          "createdAt": "2022-11-14T09:41:12.664Z",
          "updatedAt": "2022-11-14T09:41:12.664Z"
      },
      {
          "id": 2,
          "name": "action",
          "createdAt": "2022-11-14T09:41:12.664Z",
          "updatedAt": "2022-11-14T09:41:12.664Z"
      },
      ...,
  ]
  ```

&nbsp;

### 13. POST /genres/add
#### Description
- Create a new genre

#### Request
- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

  - req.userAuthorization:
  ```json
  {
    "authorId": Integer
  }
  ```

- Body
    ```json
    {
      "name": String | required,
    }
    ```

#### Response
_201 - Created
- Body
    ```json
    {
        "name": Integer,
    }
    ```

&nbsp;

## 14. DELETE /genres/delete/:genreId

Description:
- Delete a genre based on a given id

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

- req.userAuthorization:
  ```json
  {
    "authorId": Integer
  }
  ```

- params:

```json
{
  "genreId": Integer 
}
```

_Response (200 - OK)_

```json
{
    "message": "Genre <genre name> has just been deleted"
}
```

```

_Response (404 - Not Found)_

```json
{
  "message": "Genre not found"
}
```
&nbsp;

## 15. PUT /genres/edit/:genreId

Description:
- Edit a genre based on a given id

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

- req.userAuthorization:
  ```json
  {
    "authorId": Integer
  }
  ```


- params:

```json
{
  "genreId": Integer 
}
```

- Body
    ```json
    {
      "name": String | required,
    }
    ```


_Response (200 - OK)_

```json
{
    "message": "Genre <previous genre name> has just been edited to <current genre name>"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Genre not found"
}
```
&nbsp;

## 16. GET /histories

Description:
- Get all histories from the database

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

_Response (200 - OK)_

  ```json
  [
       {
        "id": 2,
        "title": "Interstellar",
        "description": "Movie'status with id 4 has been updated from Active to Archived",
        "updatedBy": "admin1@mail.com",
        "createdAt": "2022-11-25T16:12:02.035Z",
        "updatedAt": "2022-11-25T16:12:02.035Z"
    },
    {
        "id": 1,
        "title": "Titanic",
        "description": "Movie'status with id 3 has    been updated from Active to Inactive",
        "updatedBy": "admin1@mail.com",
        "createdAt": "2022-11-25T16:11:34.786Z",
        "updatedAt": "2022-11-25T16:11:34.786Z"
    }
      ...,
  ]
  ```

&nbsp;

## 17. GET /wishlists/pub

Description:
- Get all wishlists 

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

_Response (200 - OK)_

  ```json
  [
    {
        "id": 3,
        "UserId": 14,
        "MovieId": 20,
        "createdAt": "2022-11-30T02:37:47.181Z",
        "updatedAt": "2022-11-30T02:37:47.181Z"
    },
    {
        "id": 4,
        "UserId": 14,
        "MovieId": 1,
        "createdAt": "2022-11-30T02:38:32.520Z",
        "updatedAt": "2022-11-30T02:38:32.520Z"
    },
    ...
]
  ```

&nbsp;


### 18. POST /wishlists/pub/addToBookmark/:movieId
#### Description
- Add a movie to wishlist

#### Request
- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```


- req.params
    ```json
    {
      "movieId": "Integer",
    }
    ```

#### Response
_201 - Created
- Body
    ```json
    
    "<movie title> has been added to your wishlist"
    
    ```
(404 - Not Found)_

  ```json
  {
    "message": "Movie not found"
  }
  ```
(400 - Bad Request)_

  ```json
  {
    "message": "This movie is already bookmarked"
  }
  ```

&nbsp;

## 14. DELETE /wishlists/pub/deleteFromBookmark/:movieId

Description:
- Delete a movie from the bookmark

Request:

- headers: 

  ```json
  {
    "access_token": "string"
  }
  ```

  ```

- params:

```json
{
  "movieId": Integer 
}
```

_Response (200 - OK)_

```json
{
    "message": "Genre <genre name> has just been deleted"
}
```

```

_Response (404 - Not Found)_

```json
{
  "message": "Genre not found"
}
OR
{
  "message": "Bookmark not found"
}
```
&nbsp;


### Global Error
#### Response
_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```
_500 - Internal Server Error_
- Body
    ```json
    {
      "statusCode": 500,
      "error": {
        "message": "Internal Server Error"
      }
    }
    ```