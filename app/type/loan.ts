export interface Loan {
    id?: number
   book_id?: number
   member_id?: number
   staff_id?: number
   borrow_date?: Date
   due_date?: Date
   return_date?: Date
   status?: string
}