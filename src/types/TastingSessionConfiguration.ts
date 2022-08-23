export type TastingSession = {
    config: TastingSessionConfiguration;
    tastingItems: TastingItem[]
}

export type TastingSessionConfiguration = {
    creatorId: string;
    creatorName: string;
    sessionName: string;
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