export const DEPARTMENTS = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "History", "Literature", "Economics", "Psychology", "Sociology"]

export const DEPARTMENTS_OPTIONS = DEPARTMENTS.map((value)=>({
    value:value,
    label: value
}))
export * from "./subjects"