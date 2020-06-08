import express from 'express';
import * as reimbService from '../services/reimb_service';

export const reimbRouter = express.Router();

/*
    http://localhost:3000/people
    Retrieves an array of people from database
*/
reimbRouter.get('', (request, response, next) => {
    reimbService.getAllReimb().then(people => {
        response.set('content-type', 'application/json');
        response.json(people);
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
reimbRouter.get('/:reimb_ID', (request, response, next) => {
    const reimb_ID = +request.params.id;
    reimbService.getReimbByID(reimb_ID).then(reimb => {
        if (!reimb) {
            response.sendStatus(404);
        } else {
            response.json(reimb);
        }
        next();
    }).catch(err => {
        response.sendStatus(500);
        next();
    })
});

reimbRouter.get('/:reimb_author', (request, response, next) => {
    const reimb_author = +request.params.id;
    reimbService.getReimbByAuthorID(reimb_author).then(reimb => {
        if (!reimb) {
            response.sendStatus(404);
        } else {
            response.json(reimb);
        }
        next();
    }).catch(err => {
        response.sendStatus(500);
        next();
    })
});

reimbRouter.get('/:reimb_resolver', (request, response, next) => {
    const reimb_resolver = +request.params.id;
    reimbService.getReimbByResolverID(reimb_resolver).then(reimb => {
        if (!reimb) {
            response.sendStatus(404);
        } else {
            response.json(reimb);
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
reimbRouter.post('', (request, response, next) => {
    const reimb = request.body;
    reimbService.createReimb(reimb)
        .then(newReimb => {
            response.status(201);
            response.json(newReimb);
            next();
        }).catch(err => {
            response.sendStatus(500);
            next();
        });
});

/* PATCH is an HTTP method that serves as partial replacement */
reimbRouter.put('/ers_reimbursment/:reimb_id/:reimb_description', (request, response, next) => {
    const reimbID = +request.params.reimb_id;
    const desc = request.params.reimb_description;
    const updatedReimb = reimbService.append_reimb_description(reimbID, desc)
        .then(updatedReimb => {
            if (updatedReimb) {
                response.json(updatedReimb);
                next();
            } else {
                response.sendStatus(404);
                next();
            }
        }).catch(err => {
            response.sendStatus(500);
            next()
        })
});

reimbRouter.put('/ers_reimbursment/:reimb_id/:reimb_receipt', (request, response, next) => {
    const reimbID = +request.params.reimb_id;
    const receipt = request.params.reimb_receipt;
    let fs = require('fs');
    fs.writeFile('recieptAsString.jpg', receipt, function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    });  
    const updatedReimb = reimbService.set_reimb_receipt(reimbID, fs)
        .then(updatedReimb => {
            if (updatedReimb) {
                response.json(updatedReimb);
                next();
            } else {
                response.sendStatus(404);
                next();
            }
        }).catch(err => {
            response.sendStatus(500);
            next()
        })
});