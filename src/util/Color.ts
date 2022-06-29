import {ColorTypes, IonicColors} from "@/types/ColorTypes";


export function getColors(): ColorTypes {
    const style = getComputedStyle(document.documentElement);
    const colors: any = {}
    Object.entries(IonicColors).forEach(([key, value]) => {
        colors[key] = style.getPropertyValue(value);
    });
    return colors as ColorTypes;
}

