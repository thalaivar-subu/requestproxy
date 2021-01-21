import safeStringify from "fast-safe-stringify";

// Parses JSON -> in case of error returns empty object
export const parseJson = (v) => {
  try {
    return JSON.parse(v);
  } catch (error) {
    return {};
  }
};

// returns true if value is array and it has enties
export const isValidArray = (v) => Array.isArray(v) && v.length > 0;

// returns true if the given value is an object
export const isObject = (value) => {
  return value && typeof value === "object" && value.constructor === Object;
};

// returns true if it is an object and it has keys
export const isValidObject = (v) => isObject(v) && Object.keys(v).length > 0;

// Object.freeze -> freezes shallow level -> so freezing nested levels
export const deepFreeze = (object) => {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);
  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
};

// Object.clone -> clones shallow level -> So deepCloning for nested Levels
export const deepClone = (v) => parseJson(safeStringify(v));
