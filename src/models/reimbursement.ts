export class Ers_reimbursement {
    reimb_id: number;
    reimb_amount: number;
    reimb_submitted: Date;
    reimb_resolved: Date;
    reimb_description: string;
    reimb_receipt: File;
    reimb_author: number;
    reimb_resolver: number;
    reimb_status_id: number;//dec=1//pend=2//app=3
    reimb_type_id: number;

    /**
     * Static function for creating a Person instance from the structure the
     * database gives us
     */
    static from(obj: Ers_reimb_row): Ers_reimbursement {
        const reimb = new Ers_reimbursement(
            obj.reimb_amount, obj.reimb_description, obj.reimb_receipt, obj.reimb_author, obj.reimb_type_id);
        return reimb;
    }

    constructor(reimbAmount: number,reimbDesc:string, reimbReceipt: File,reimbAuthor: number, reimbTypeID: number) {
       // any value omitted is to either prevent b=someone from cookiing books or because it will be automcatically set in dBeaver
        this.reimb_amount = reimbAmount;
        this.reimb_description = reimbDesc;
        this.reimb_receipt = reimbReceipt;
        this.reimb_author = reimbAuthor;
        this.reimb_type_id = reimbTypeID;
    }

    /* Alternatively use this without property declaration */
    // constructor(private id: number, private firstName: string,
    //             private lastName: string, private birthdate: Date) {
    // }
}

export interface Ers_reimb_row {
    reimb_id: number;
    reimb_amount: number;
    reimb_submitted: Date;
    reimb_resolved: Date;
    reimb_description: string;
    reimb_receipt: File;
    reimb_author: number;
    reimb_resolver: number;
    reimb_status_id: number;
    reimb_type_id: number;
}