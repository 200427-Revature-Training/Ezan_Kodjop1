import express from 'express'; 
import * as userService from '../services/user_service';

export const userRouter = express.Router();

/*
    http://localhost:3000/people
    Retrieves an array of people from database
*/
userRouter.get('', (request, response, next) => {
    userService.getAllUsers().then(users => {
        response.set('content-type', 'application/json');
        response.json(users);
        next();
    }).catch(err => {
        response.sendStatus(500);
    });
});

/*
    http://localhost:3000/people/1
    Retrieves a single person from the database by id
    If the person does not exist, sends 404
*/
userRouter.get('/:ers_user_id', (request, response, next) => {
    const id = +request.params.id;
    userService.getUserById(id).then(user => {
        if (!user) {
            response.sendStatus(404);
        } else {
            response.json(user);
        }
        next();
    }).catch(err => {
        response.sendStatus(500);
        next();
    })
});

userRouter.get('/:ers_username', (request, response, next) => {
    const un = request.params.id;
    userService.getUserByUsername(un).then(user => {
        if (!user) {
            response.sendStatus(404);
        } else {
            response.json(user);
        }
        next();
    }).catch(err => {
        response.sendStatus(500);
        next();
    })
});

userRouter.get('/ers_users/:ers_username/:ers_password', (request, response, next) => {
    const username = request.params.ers_username;
    const password = request.params.ers_password;
    const roleID = +request.params.user_role_id;
    userService.login(username, password,roleID).then(cred => {
        if (!cred) {
            response.sendStatus(400);
        }
        else {
            response.json(cred);
        }
        next();
    }).catch(err => {
        response.sendStatus(500);
        next();
    })
});

/*
* GET /people/{id}/pets - Array of pets owned by that user
* or 404 if the user does not exist
*/
/*peopleRouter.get('/:id/pets', async (request, response, next) => {
    const id: number = parseInt(request.params.id);

    let pets: Pet[];

    try {
        pets = await peopleService.getPetsByPersonId(id);
    } catch (err) {
        response.sendStatus(500);
        console.log(err);
        return;
    }

    // Dao returns undefined for non-existent person
    if (!pets) {
        response.sendStatus(404);
    } else {
        response.json(pets);
    }
    next();
});*/

/*
    POST http://localhost:3000/people
    Creates a new person and saves them to the database.
    Returns the inserted data as JSON with status 201.
*/
userRouter.post('', (request, response, next) => {
    const user = request.body;
    userService.createUser(user)
        .then(newUser => {
            response.status(201);
            response.json(newUser);
            next();
        }).catch(err => {
            response.sendStatus(500);
            next();
        });
});

/* PATCH is an HTTP method that serves as partial replacement */
userRouter.patch('', (request, response, next) => {
    const user = request.body;
    userService.patchUser(user)
        .then(updatedUser => {
            if (updatedUser) {
                response.json(updatedUser);
                next();
            } else {
                response.sendStatus(404);
                next();
            }
        }).catch(err => {
            response.sendStatus(500);
            next();

        });
});