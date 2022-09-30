export enum Action {
    Create = "create",
    Rename = "rename",
    Delete = "delete",
    UpdateIndex = "updateIndex"
}

export type UpdateActionItem = {
    action: Action,
    itemName: string,
    newName?: string,
    index: number,
    newIndex?: number,
}
