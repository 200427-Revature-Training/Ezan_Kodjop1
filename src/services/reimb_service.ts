import { Ers_reimbursement} from '../models/reimbursement';
import * as reimbDao from '../daos/reimb_dao';

export function getAllReimb(): Promise<Ers_reimbursement[]> {
    // Apply internal business logic
    return reimbDao.getAllReimb();
}

export function getReimbApproved(): Promise<Ers_reimbursement[]> {
    // Apply internal business logic
    return reimbDao.getReimbApproved();
}

export function getReimbPending(): Promise<Ers_reimbursement[]> {
    // Apply internal business logic
    return reimbDao.getReimbPending();
}

export function getReimbDeclined(): Promise<Ers_reimbursement[]> {
    // Apply internal business logic
    return reimbDao.getReimbDeclined();
}

export function getReimbByID(reimbId: number): Promise<Ers_reimbursement> {
    // Apply internal business logic
    return reimbDao.getReimbByID(reimbId);
}

export function getReimbByAuthorID(authorId: number): Promise<Ers_reimbursement> {
    // Apply internal business logic
    return reimbDao.getReimbByAuthorID(authorId);
}

export function getReimbByResolverID(resolvId: number): Promise<Ers_reimbursement> {
    // Apply internal business logic
    return reimbDao.getReimbByAuthorID(resolvId);
}

/*export function reimbExists(reimbID: number): Promise < boolean > {
    return reimbDao.reimbExists(reimbID);
}*///unnecessary?
/* function getPetsByPersonId(id: number): Promise<Pet[]> {
    return peopleDao.getPetsByPersonId(id);
}*/

export function createReimb(reimb: any): Promise<Ers_reimbursement> {

    // Data from the user cannot be trusted
    const newReimb = new Ers_reimbursement(
        reimb.reimb_amount,
        reimb.reimb_description,
        reimb.reimb_receipt,
        reimb.reimb_author,
        reimb.reimb_type_id
    );

    // IF we're going validate it here, we probably want
    // constraints on the db too

    if(reimb.reimb_amount && reimb.reimb_author && reimb.reimb_type_id) {
        // Data is valid - Continue submitting to DAO
        return reimbDao.createReimb(newReimb);
    } else {
        // TODO: We should fail here, probably issue some kind of 400
        return new Promise((resolve, reject) => reject(422));
    }
}


/*export function patchPerson(input: any): Promise<Person> {

    // We don't want to create Date(undefined) so check if input.birthdate
    // is defined, otherwise just pass undefined along
    const birthdate = input.birthdate && new Date(input.birthdate);

    const person = new Person(
        input.id, input.firstName,
        input.lastName, birthdate
    );

    if (!person.id) {
        throw new Error('400');
    }

    return peopleDao.patchPerson(person);
}*/

export function append_reimb_description(reimbID: number, desc: string): Promise<Ers_reimbursement> {
    return reimbDao.append_reimb_description(reimbID, desc);
}

export function set_reimb_receipt(reimbID: number, receipt: File): Promise<Ers_reimbursement> {
    return reimbDao.set_reimb_receipt(reimbID, receipt);
}