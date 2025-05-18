export interface RecentOperation {
    id: number
    type: string
    item: unknown
}

export interface Operation extends RecentOperation{
    date: Date
}

export interface OperationDetail extends Operation {
    table: string
    user: unknown
    oldValue: unknown
    newValue: unknown
}