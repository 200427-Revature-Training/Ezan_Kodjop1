import { db } from '../daos/db';
import { Ers_user, Ers_user_row } from '../models/ers_user';
import { Ers_reimb_row, Ers_reimbursement } from '../models/reimbursement';
import { getReimbByID } from './reimb_dao';
/**
 * If we are using a one-off query for, we can just use db.query - it will have a connection
 * issue the query without having to pull it from the pool.
 *
 * query(sql, [params, ...]);
 */



export function getAllUsers(): Promise<Ers_user[]> {
    const sql = 'SELECT * FROM ERS_USERS';

    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<Ers_userRow>
    // 3. We can react to the database response by chaining a .then onto the query
    return db.query<Ers_user_row>(sql, []).then(result => {
        // 4. Extract rows from the query response
        const rows: Ers_user_row[] = result.rows;

        //console.log(rows);

        // 5. Convert row data format to Person objects
        const users: Ers_user[] = rows.map(row => Ers_user.from(row));
        return users;
    });
}

export function getUserById(id: number): Promise<Ers_user> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM ERS_USERS WHERE ERS_USER_ID = $1';
    if (!userIdExists(id)) { return null; }
    else {
        return db.query<Ers_user_row>(sql, [id])
            .then(result => result.rows.map(row => Ers_user.from(row))[0]);
    }
}

export function login(username:string,password:string): Promise<Ers_user> {
    const Crypto = require('crypto-js');
    password = Crypto.SHA1(password, 50).toString(); //password is hashed with a string 50 charachtsrs long
    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM ERS_USERS WHERE ERS_USERNAME = $1 AND ERS_PASSWORD =$2;';
    return db.query<Ers_user_row>(sql, [username,password])
        .then(result => result.rows.map(row => Ers_user.from(row))[0]);
}

export function getUserByUsername(un: string): Promise<Ers_user> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM ERS_USERS WHERE ERS_USERNAME = $1';
    if (!usernameExists(un)) { return null; }
    else {
        return db.query<Ers_user_row>(sql, [un])
            .then(result => result.rows.map(row => Ers_user.from(row))[0]);
    }
}

/* Async function - A function that is naturally asynchronous.  The return value of an async
function MUST be a promise.  If a non-promise value is returned, it will implicitly be wrapped
in a promise. Async functions are the only places where the 'await' keyword may be used. The
await keyword is a keyword used to call async functions which implicitly unwraps the promise
and pauses execution in the current context until the asynchronous function has resolved. */
/*export async function getPetsByPersonId(personId: number): Promise<Pet[]> {
    const userExists: boolean = await personExists(personId);
    if (!userExists) {
        return undefined;
    }

    const sql = `SELECT pets.* FROM pet_owners \
LEFT JOIN pets ON pet_owners.pets_id = pets.id \
WHERE people_id = $1`;

    // await will pause execution, waiting for the promise to resolve, then evaluate to 
    // value the promise resolves to
    const result = await db.query<Pet>(sql, [personId]);
    return result.rows;

}*/

/*
    Function to check if a user exists with a given ID
*/
export async function userIdExists(userId: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT ERS_USER_ID FROM ERS_USERS WHERE ERS_USER_ID = $1);`;
    const result = await db.query<Exists>(sql, [userId]);
    return result.rows[0].exists;
}

export async function usernameExists(username: string): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT ERS_USERNAME FROM ERS_USERS WHERE ERS_USERNAME = $1);`;
    const result = await db.query<Exists>(sql, [username]);
    return result.rows[0].exists;
}

export async function isFinMan(userId: number): Promise<boolean> {
    const sql = `2 IN (SELECT ERS_ROLE_ID FROM ERS_USERS WHERE ERS_USER_ID = $1);`;
    const result = await db.query<Exists>(sql, [userId]);
    return result.rows[0].exists;
}

export function createUser(user: Ers_user): Promise<Ers_user> {
    const Crypto = require('crypto-js');
    user.ers_password = Crypto.SHA1(user.ers_password,50).toString(); //password is hashed with a string 50 charachtsrs long
    const sql = `INSERT INTO people (ers_username, ers_password, user_first_name,user_last_name,user_email,user_role_id) \
VALUES ($1, $2, $3,$4,$5,$6) RETURNING *`;

    return db.query<Ers_user_row>(sql, [
        user.ers_username,
        user.ers_password,
        user.user_first_name,
        user.user_last_name,
        user.user_email,
        user.user_role_id
    ]).then(result => result.rows.map(row => Ers_user.from(row))[0]);
}

export function patchUser(user: Ers_user): Promise<Ers_user> {
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'
    if (!userIdExists(user.ers_user_id)) {
        return null
    }
    const Crypto = require('crypto-js');
    user.ers_password = Crypto.SHA1(user.ers_password, 50).toString(); //password is hashed with a string 50 charachtsrs long
    /////////////////////only financial managers can change their role
    let sql='';
    if (!isFinMan(user.user_role_id)) {
        sql = `UPDATE ERS_USERS SET ERS_USERNAME = COALESCE($2, ers_username), \
            ERS_PASSWORD = COALESCE($3, ers_password), USER_FIRST_NAME = COALESCE($4, user_first_name), \
            USER_LAST_NAME = COALESCE($5, user_last_name), USER_EMAIL = COALESCE($6, user_email), \
            WHERE ERS_USER_ID = $1 RETURNING *`;
        console.log('Only financial managers may change their role.')
    }
    else {
        sql = `UPDATE ERS_USERS SET ERS_USERNAME = COALESCE($2, ers_username), \
            ERS_PASSWORD = COALESCE($3, ers_password), USER_FIRST_NAME = COALESCE($4, user_first_name), \
            USER_LAST_NAME = COALESCE($5, user_last_name), USER_EMAIL = COALESCE($6, user_email), \
            USER_ROLE_ID = COALESCE($7,user_role_id) WHERE ERS_USER_ID = $1 RETURNING *`;
    }
    // if we call toISOString on undefined, we get a TypeError, since undefined
    // is valid for patch, we guard operator to defend against calling
    // .toISOString on undefined, allowing COALESCE to do its job
    //const birthdate = person.birthdate && person.birthdate.toISOString();

    const params = [
        user.ers_user_id,
        user.ers_username,
        user.ers_password,
        user.user_first_name,
        user.user_last_name,
        user.user_email,
        user.user_role_id
    ];

    return db.query<Ers_user_row>(sql, params)
        .then(result => result.rows.map(row => Ers_user.from(row))[0]);
}

export function decline_reimb(reimbID: number, resolvID: number) {// removed ": Promise<Ers_reimbursement>"
    const sql = `UPDATE ERS_REIMBURSMENT SET REIMB_STATUS_ID = 1 WHERE REIMB_ID = COALESCE($1, INTEGER); \
        UPDATE ERS_REIMBURSMENT SET REIMB_RESOLVER = COALESCE($2,INTEGER) WHERE REIMB_ID = COALESCE($1,INTEGER); \
        UPDATE ERS_REIMBURSMENT SET REIMB_RESOLVED = CURRENT_TIMESTAMP() WHERE REIMB_ID = COALESCE($1,INTEGER);`;
    let reimb = getReimbByID(reimbID).then(reimb => {//What happens when varchar runs out of charachtars??
        if (!reimb) { return null; }//shows the reimb doesnt exist 
        else {
            let user = getUserById(resolvID).then(user => {
                if (!user) { return null; }//ensure resolver exists
                else {
                    let fin = isFinMan(resolvID).then(fin => {
                        if (!fin) { return null; }
                        else {
                            // if we call toISOString on undefined, we get a TypeError, since undefined
                            // is valid for patch, we guard operator to defend against calling
                            // .toISOString on undefined, allowing COALESCE to do its job
                            const reimb_resolved = reimb.reimb_resolved && reimb.reimb_resolved.toISOString();
                            const params = [
                                reimb.reimb_id,
                                reimb.reimb_amount,
                                reimb.reimb_submitted.toISOString(),
                                reimb.reimb_resolved.toISOString(),
                                reimb.reimb_description,
                                reimb.reimb_receipt,
                                reimb.reimb_author,
                                reimb.reimb_resolver,
                                reimb.reimb_status_id,
                                reimb.reimb_type_id
                            ];
                            return db.query<Ers_reimb_row>(sql, params)
                                .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
                        }
                    })
                }
            })
        }
    });
}

export function approve_reimb(reimbID: number, resolvID: number) {// removed ": Promise<Ers_reimbursement>"
    const sql = `UPDATE ERS_REIMBURSMENT SET REIMB_STATUS_ID = 3 WHERE REIMB_ID = COALESCE($1, INTEGER); \
        UPDATE ERS_REIMBURSMENT SET REIMB_RESOLVER = COALESCE($2,INTEGER) WHERE REIMB_ID = COALESCE($1,INTEGER); \
        UPDATE ERS_REIMBURSMENT SET REIMB_RESOLVED = CURRENT_TIMESTAMP() WHERE REIMB_ID = COALESCE($1,INTEGER);`;
    let reimb = getReimbByID(reimbID).then(reimb => {//What happens when varchar runs out of charachtars??
        if (!reimb) { return null; }//shows the reimb doesnt exist 
        else {
            let user = getUserById(resolvID).then(user => {
                if (!user) { return null; }//ensure resolver exists
                else {
                    let fin = isFinMan(resolvID).then(fin => {
                        if (!fin) { return null; }
                        else {
                        // if we call toISOString on undefined, we get a TypeError, since undefined
                        // is valid for patch, we guard operator to defend against calling
                     // .toISOString on undefined, allowing COALESCE to do its job
                            const reimb_resolved = reimb.reimb_resolved && reimb.reimb_resolved.toISOString();
                            const params = [
                            reimb.reimb_id,
                            reimb.reimb_amount,
                            reimb.reimb_submitted.toISOString(),
                            reimb.reimb_resolved.toISOString(),
                            reimb.reimb_description,
                            reimb.reimb_receipt,
                            reimb.reimb_author,
                            reimb.reimb_resolver,
                            reimb.reimb_status_id,
                            reimb.reimb_type_id
                        ];
                        return db.query<Ers_reimb_row>(sql, params)
                            .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
                        }
                    })
                }
            })
        }
    });
}

interface Exists {
    exists: boolean;
}