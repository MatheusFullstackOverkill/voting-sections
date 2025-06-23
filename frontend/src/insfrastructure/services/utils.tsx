export interface ListRequest {
    offset: number,
    limit: number
}

export interface ListResponse<T> {
    count: number,
    data: T[]
}