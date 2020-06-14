import { db } from '../daos/db';
import { Ers_reimbursement, Ers_reimb_row } from '../models/reimbursement';
import { getUserById, isFinMan } from './user_dao';
/**
 * If we are using a one-off query for, we can just use db.query - it will have a connection
 * issue the query without having to pull it from the pool.
 *
 * query(sql, [params, ...]);
 */

export function getAllReimb(): Promise<Ers_reimbursement[]> {
    const sql = 'SELECT * FROM ERS_REIMBURSMENT';

    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<PersonRow>
    // 3. We can react to the database response by chaining a .then onto the query
    return db.query<Ers_reimb_row>(sql, []).then(result => {
        // 4. Extract rows from the query response
        const rows: Ers_reimb_row[] = result.rows;
       // console.log(rows);

        // 5. Convert row data format to Person objects
        const reimb: Ers_reimbursement[] = rows.map(row => Ers_reimbursement.from(row));
        return reimb;
    });
}

/*export function getReimbByID(reimbId: number): Promise<Ers_reimbursement> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE REIMB_ID = $1';

    return db.query<Ers_reimb_row>(sql, [reimbId])
        .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
}*/

export function getReimbByID(reimbId: number): Promise<Ers_reimbursement> {//check to see if user exists first
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;
    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    if (reimbExists(reimbId)) {
        const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE REIMB_ID = $1';
        return db.query<Ers_reimb_row>(sql, [reimbId])
            .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
    }
    else { return null;}
}

export function getReimbType(reimbTypeID: number): Promise<Ers_reimbursement> {//check to see if user exists first
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;
    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM ERS_REIMBURSMENT_TYPE WHERE REIMB_TYPE_ID = $1';
    return db.query<Ers_reimb_row>(sql, [reimbTypeID])
            .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
}

export function getReimbStatus(reimbStat: number): Promise<Ers_reimbursement> {//check to see if user exists first
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;
    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM ERS_REIMBURSMENT_STATUS WHERE REIMB_STATUS_ID = $1';
    return db.query<Ers_reimb_row>(sql, [reimbStat])
        .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
}

/*export function getReimbByAuthorID(authorId: number): Promise<Ers_reimbursement> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE REIMB_AUTHOR = $1';

    return db.query<Ers_reimb_row>(sql, [authorId])
        .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
}*/
export function getReimbByAuthorID(reimbAuthorID: number): Promise<Ers_reimbursement> {//check to see if user exists first
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;
    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    if (reimbAuthorExists(reimbAuthorID)) {
        const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE REIMB_AUTHOR = $1';
        return db.query<Ers_reimb_row>(sql, [reimbAuthorID])
            .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
    }
    else { return null; }
}

/*export function getReimbByResolverId(resolvId: number): Promise<Ers_reimbursement> {
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;

    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE RESOLVER_ID = $1';

    return db.query<Ers_reimb_row>(sql, [resolvId])
        .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
}*/
export function getReimbByResolverID(reimbResolverID: number): Promise<Ers_reimbursement> {//check to see if user exists first
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;
    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    if (reimbAuthorExists(reimbResolverID)) {
        const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE REIMB_RESOLVER = $1';
        return db.query<Ers_reimb_row>(sql, [reimbResolverID])
            .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
    }
    else { return null; }
}
export function getReimbApproved(): Promise<Ers_reimbursement[]> {
    const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE REIMB_STATUS_ID = 3';
    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<PersonRow>
    // 3. We can react to the database response by chaining a .then onto the query
    return db.query<Ers_reimb_row>(sql, []).then(result => {
        // 4. Extract rows from the query response
        const rows: Ers_reimb_row[] = result.rows;
        // console.log(rows);

        // 5. Convert row data format to Person objects
        const reimb: Ers_reimbursement[] = rows.map(row => Ers_reimbursement.from(row));
        return reimb;
    });
}

export function getReimbPending(): Promise<Ers_reimbursement[]> {
    const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE REIMB_STATUS_ID = 2';
    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<PersonRow>
    // 3. We can react to the database response by chaining a .then onto the query
    return db.query<Ers_reimb_row>(sql, []).then(result => {
        // 4. Extract rows from the query response
        const rows: Ers_reimb_row[] = result.rows;
        // console.log(rows);

        // 5. Convert row data format to Person objects
        const reimb: Ers_reimbursement[] = rows.map(row => Ers_reimbursement.from(row));
        return reimb;
    });
}

export function getReimbDeclined(): Promise<Ers_reimbursement[]> {
    const sql = 'SELECT * FROM ERS_REIMBURSMENT WHERE REIMB_STATUS_ID = 1';
    // 1. Query database using sql statement above
    // 2. Query will return a promise typed as QueryResult<PersonRow>
    // 3. We can react to the database response by chaining a .then onto the query
    return db.query<Ers_reimb_row>(sql, []).then(result => {
        // 4. Extract rows from the query response
        const rows: Ers_reimb_row[] = result.rows;
        // console.log(rows);

        // 5. Convert row data format to Person objects
        const reimb: Ers_reimbursement[] = rows.map(row => Ers_reimbursement.from(row));
        return reimb;
    });
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
export async function reimbExists(reimbID: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT REIMB_ID FROM ERS_REIMBURSMENT WHERE REIMB_ID = $1);`;
    const result = await db.query<Exists>(sql, [reimbID]);
    return result.rows[0].exists;
}

export async function reimbAuthorExists(reimbAuthorID: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT REIMB_AUTHOR FROM ERS_REIMBURSMENT WHERE REIMB_AUTHOR = $1);`;
    const result = await db.query<Exists>(sql, [reimbAuthorID]);
    return result.rows[0].exists;
}

export async function reimbResolverExists(reimbResolverID: number): Promise<boolean> {
    const sql = `SELECT EXISTS(SELECT REIMB_AUTHOR FROM ERS_REIMBURSMENT WHERE REIMB_RESOLVER = $1);`;
    const result = await db.query<Exists>(sql, [reimbResolverID]);
    return result.rows[0].exists;
}

export function createReimb(reimb: Ers_reimbursement): Promise<Ers_reimbursement> {//current_timestamp is "is in the sql standard. The others are postgresql specific, though other databases may also implement them"
    const sql = `INSERT INTO ERS_REIMBURSMENT (reimb_amount, reimb_submitted, reimb_resolved,reimb_description,reimb_receipt,reimb_author,reimb_resolver,reimb_status_id,reimb_type_id) \
VALUES ($2, CURRENT_TIMESTAMP(), NULL,$4,$5,$6,NULL,2,$9) RETURNING *`;//2 is for pending the rest are null to be edited when appropriate 

    return db.query<Ers_reimb_row>(sql, [
        reimb.reimb_id,
        reimb.reimb_amount,
        reimb.reimb_submitted.toISOString(),
        undefined,//cant call .toISO to a null
        reimb.reimb_description,
        reimb.reimb_receipt,
        reimb.reimb_author,
        reimb.reimb_resolver,
        reimb.reimb_status_id,
        reimb.reimb_type_id
    ]).then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
}
//concats string argument with existing description
/*export function set_reimb_append_description(reimbID: number, desc: string): Promise<Ers_reimbursement> {// removed ": Promise<Ers_reimbursement>"
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'
    
    const sql = `UPDATE ERS_REIMBURSMENT SET REIMB_DESCRIPTION = \
        CONCAT(SELECT ERS_REINBURSMENT WHERE REIMB_ID = COALESCE($1, INTEGER), 'EDIT:', COALESCE($2, STRING)) \
        WHERE REIMB_ID = COALESCE($1, INTEGER)`;//appends given string to the old string with "Edit:" as a mark to let those know it was done after creation
    let reimb = getReimbByID(reimbID).then(reimb => {//What happens when varchar runs out of charachtars??
        if (!reimb) { return null;}//shows the reimb doesnt exist 
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
    });
}*/

export function append_reimb_description(reimbId: number,desc:string): Promise<Ers_reimbursement> {//check to see if user exists first
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;
    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = `UPDATE ERS_REIMBURSMENT SET REIMB_DESCRIPTION = \
        CONCAT(SELECT ERS_REINBURSMENT WHERE REIMB_ID = COALESCE($1, INTEGER), 'EDIT:', COALESCE($2, STRING)) \
        WHERE REIMB_ID = COALESCE($1, INTEGER)`;//appends given string to the old string with "Edit:" as a mark to let those know it was done after creation
        return db.query<Ers_reimb_row>(sql, [reimbId])
            .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
}

/*export function set_reimb_reciept(reimbID: number, receipt: File) {// removed ": Promise<Ers_reimbursement>"
    // coalesce(null, 'hello') --> 'hello'
    // coalesce('hello', 'goodbye') --> 'hello'

    const sql = `UPDATE ERS_REIMBURSMENT SET REIMB_RECEIPT = COALESCE($2, BYTEA) WHERE REIMB_ID = COALESCE($1, INTEGER)`;//File->BYTEA conversion may cause issue 
    let reimb = getReimbByID(reimbID).then(reimb => {
        if (!reimb) { return null; }//shows the reimb doesnt exist 
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
    });
}*/

export function set_reimb_receipt(reimbId: number, receipt: File): Promise<Ers_reimbursement> {//check to see if user exists first
    // DO NOT ACTUALLY DO THIS
    // const sql = 'SELECT * FROM people WHERE id = ' + id;
    // Use parameterized queries to avoid SQL Injection
    // $1 -> Parameter 1 placeholder
    const sql = `UPDATE ERS_REIMBURSMENT SET REIMB_RECEIPT = COALESCE($2, BYTEA) WHERE REIMB_ID = COALESCE($1, INTEGER)`;//appends given string to the old string with "Edit:" as a mark to let those know it was done after creation
    return db.query<Ers_reimb_row>(sql, [reimbId,receipt])
        .then(result => result.rows.map(row => Ers_reimbursement.from(row))[0]);
}

export function decline_reimb(reimbID: number, resolvID: number): any {// removed ": Promise<Ers_reimbursement>"
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

export function approve_reimb(reimbID: number, resolvID: number): any {// removed ": Promise<Ers_reimbursement>"
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