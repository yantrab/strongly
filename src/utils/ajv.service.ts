import { set } from "lodash";

const ajvMap = { number: "imum", string: "Length", array: "Items", object: "Properties" };
export const getMinMaxValidation = (keyword, type, value) => set({}, keyword + ajvMap[type.toLowerCase()], value);
