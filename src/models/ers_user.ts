export class Ers_user {
    ers_user_id: number;
    ers_username: string;
    ers_password: string;
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_role_id: number;//EMPLOYEE=1, FINANCE=2

    /**
     * Static function for creating a Person instance from the structure the
     * database gives us
     */
    static from(obj: Ers_user_row): Ers_user {
        const user = new Ers_user(
            obj.ers_username, obj.ers_password, obj.user_first_name, obj.user_last_name, obj.user_email,obj.user_role_id);
        return user;
    }

    constructor(userName: string, password: string, firstName: string, lastName: string, email: string, roleID: number) {
        this.ers_user_id = 0;//irrelevant as it will be set
        this.ers_username = userName;
        this.ers_password = password;
        this.user_first_name = firstName;
        this.user_last_name = lastName;
        this.user_email = email;
        this.user_role_id = roleID;
    }

    /* Alternatively use this without property declaration */
    // constructor(private id: number, private firstName: string,
    //             private lastName: string, private birthdate: Date) {
    // }
}

export interface Ers_user_row {
    ers_user_id: number;
    ers_username: string;
    ers_password: string;
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_role_id: number;
}