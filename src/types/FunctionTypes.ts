export interface BoolRefSetter{
    (state: boolean): void;
}

export interface StringRefSetter{
    (state: string): void;
}

export interface NumberRefSetter{
    (state: number): void;
}

export interface GenericRefSetter{
    (state: any): void;
}