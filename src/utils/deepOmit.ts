import { omitBy } from "lodash";
export function omitDeepBy<T>(input, by?) {
  function omitDeepOnOwnProps(obj) {
    if (typeof input === "undefined") {
      return input;
    }

    if (!Array.isArray(obj) && !isObject(obj)) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return omitDeepBy(obj, by);
    }

    const o = {};
    for (const [key, value] of Object.entries(obj)) {
      o[key] = !isNil(value) ? omitDeepBy(value, by) : value;
    }

    return omitBy(o, by);
  }

  if (Array.isArray(input)) {
    return input.map(omitDeepOnOwnProps);
  }

  return omitDeepOnOwnProps(input);
}

function isNil(value) {
  return value === null || value === undefined;
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
