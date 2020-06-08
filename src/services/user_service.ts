import { Ers_user} from '../models/ers_user';
import * as userDao from '../daos/user_dao';

export function getAllUsers(): Promise<Ers_user[]> {
    // Apply internal business logic
    return userDao.getAllUsers();
}

export function login(username: string, password: string, roleID: number): Promise<Ers_user> {
    return userDao.login(username, password,roleID);
}

export function getUserById(id: number): Promise<Ers_user> {
    const output = userDao.getUserById(id);
    if (output == null) { return new Promise((resolve, reject) => reject(404)); }
    return output;
}

export function getUserByUsername(un: string): Promise<Ers_user> {
    // Apply internal business logic
    const output = userDao.getUserByUsername(un)
    if (output == null) { return new Promise((resolve, reject) => reject(404));}
    return output;
}

/*export function getPetsByPersonId(id: number): Promise<Pet[]> {
    return peopleDao.getPetsByPersonId(id);
}*/

export function createUser(user: any): Promise<Ers_user> {

    // Data from the user cannot be trusted
    const newUser = new Ers_user(
        user.ers_username,
        user.ers_password,
        user.user_first_name,
        user.user_last_name,
        user.user_email,
        user.user_role_id
    );

    // IF we're going validate it here, we probably want
    // constraints on the db too

    if(user.ers_username && user.ers_password && user.user_first_name && user.user_last_name && user.user_email && user.user_role_id) {
        // Data is valid - Continue submitting to DAO
        return userDao.createUser(newUser);
    } else {
        // TODO: We should fail here, probably issue some kind of 400
        return new Promise((resolve, reject) => reject(422));
    }
}


export function patchUser(user: Ers_user): Promise<Ers_user> {

    // We don't want to create Date(undefined) so check if input.birthdate
    // is defined, otherwise just pass undefined along
    //const birthdate = input.birthdate && new Date(input.birthdate);
 /*   const updatedUser = new Ers_user(user.ers_username,
        user.ers_password,
        user.user_first_name,
        user.user_last_name,
        user.user_email,
        user.user_role_id
    );*/
    if (!user.ers_user_id) {
        return new Promise((resolve, reject) => reject(404));
    }
    //edit later to be able to differentiate whether or not a emp role failed in an update
    return userDao.patchUser(user);
}