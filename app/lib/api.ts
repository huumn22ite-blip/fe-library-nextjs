export const NEXT_PUBLIC_BOOKS_API_URL = "https://be-library-go-production.up.railway.app/books"
export const NEXT_PUBLIC_CATEGORIES_API_URL="be-library-go-production.up.railway.app/categories"
export const NEXT_PUBLIC_STAFF_API_URL = "https://be-library-go-production.up.railway.app/staff"
export const NEXT_PUBLIC_LOANS_API_URL="https://be-library-go-production.up.railway.app/loans"
export const NEXT_PUBLIC_MEMBERS_API_URL="https://be-library-go-production.up.railway.app/members"
import { Book } from "../type/book";
import { Category } from "../type/category"
import { Loan } from "../type/loan"
import { Member } from "../type/member"
import { Staff } from "../type/staff";

export async function getBooks(): Promise<Book[]> {
    const res = await fetch(NEXT_PUBLIC_BOOKS_API_URL)
    return res.json()
}
export async function createBooks(data: Book): Promise<Book> {
    const res = await fetch(NEXT_PUBLIC_BOOKS_API_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)

    })
    return res.json()
}
export async function updateBooks(id: number, data: Book): Promise<Book[]> {
    const res = await fetch(`${NEXT_PUBLIC_BOOKS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)
    })
    return res.json()
}
export async function deleteBooks(id: number) {
    const res = await fetch(`${NEXT_PUBLIC_BOOKS_API_URL}/${id}`, {
        method: "DELETE",
    })
    return res.json()


}




export async function getStaff(): Promise<Staff[]> {
    const res = await fetch(NEXT_PUBLIC_STAFF_API_URL)
    return res.json()
}
export async function createStaff(data: Staff): Promise<Staff> {
    const res = await fetch(NEXT_PUBLIC_STAFF_API_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)

    })
    return res.json()
}
export async function updateStaff(id: number, data: Staff): Promise<Staff[]> {
    const res = await fetch(`${NEXT_PUBLIC_STAFF_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)

    })
    return res.json()
}
export async function deleteStaff(id: number) {
    const res = await fetch(`${NEXT_PUBLIC_STAFF_API_URL}/${id}`, {
        method: "DELETE",



    })
    return res.json()


}





export async function getCategory(): Promise<Category[]> {
    const res = await fetch(NEXT_PUBLIC_CATEGORIES_API_URL)
    return res.json()
}
export async function createCategory(data: Category): Promise<Category> {
    const res = await fetch(NEXT_PUBLIC_CATEGORIES_API_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)

    })
    return res.json()
}
export async function updateCategory(id: number, data: Category): Promise<Category[]> {
    const res = await fetch(`${NEXT_PUBLIC_CATEGORIES_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)

    })
    return res.json()
}
export async function deleteCategory(id: number) {
    const res = await fetch(`${NEXT_PUBLIC_CATEGORIES_API_URL}/${id}`, {
        method: "DELETE",



    })
    return res.json()


}










export async function getMember(): Promise<Member[]> {
    const res = await fetch(NEXT_PUBLIC_MEMBERS_API_URL)
    return res.json()
}
export async function createMember(data: Member): Promise<Member> {
    const res = await fetch(NEXT_PUBLIC_MEMBERS_API_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)

    })
    if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || `Create member failed with status ${res.status}`)
    }

    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
        return res.json()
    }

    throw new Error("Create member succeeded but response is not JSON")
}
export async function updateMember(id: number, data: Member): Promise<Member[]> {
    const res = await fetch(`${NEXT_PUBLIC_MEMBERS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)

    })
    return res.json()
}
export async function deleteMember(id: number) {
    const res = await fetch(`${NEXT_PUBLIC_MEMBERS_API_URL}/${id}`, {
        method: "DELETE",



    })
    return res.json()


}






export async function getLoan(): Promise<Loan[]> {
    const res = await fetch(NEXT_PUBLIC_LOANS_API_URL)
    return res.json()
}
export async function createLoan(data: Loan): Promise<Loan> {
    const res = await fetch(NEXT_PUBLIC_LOANS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })

    const text = await res.text()

    if (!res.ok) {
        throw new Error(text || `Create loan failed: ${res.status}`)
    }

    try {
        return JSON.parse(text)
    } catch {
        throw new Error("Response is not valid JSON")
    }
}
export async function updateLoan(id: number, data: Loan): Promise<Loan[]> {
    const res = await fetch(`${NEXT_PUBLIC_LOANS_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data)

    })
    return res.json()
}
export async function deleteLoan(id: number) {
    const res = await fetch(`${NEXT_PUBLIC_LOANS_API_URL}/${id}`, {
        method: "DELETE",



    })
    return res.json()


}
