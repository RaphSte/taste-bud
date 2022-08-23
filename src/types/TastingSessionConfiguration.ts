export type TastingSession = {
    config: TastingSessionConfiguration;
    tastingItems: TastingItem[]
}

export type TastingSessionConfiguration = {
    sessionKey: string;
    creatorId: string;
    creatorName: string
    categories: string[];
}

export type TastingItem = {
    tastingItemName: string,
    ratings: TasteRating[],
}

export type TasteRating = {
    category: string,
    rating: number,
    ratedBy: string,
}