const has = Object.prototype.hasOwnProperty;
const toString = Object.prototype.toString;
// eslint-disable-next-line
function isEmpty (val) {

  if (val == null) return true;

  if (typeof val === 'boolean') return false;

  if (typeof val === 'number') return val === 0;

  if (typeof val === 'string') return val.length === 0;

  if (typeof val === 'function') return val.length === 0;

  if (Array.isArray(val)) {
    const object = val instanceof Object;
    if (object) {
      return Object.keys(val).length === 0;
    } else {
      return val.length === 0;
    }
  }

  if (val instanceof Error) return val.message === '';

  if (val.toString === toString) {
    // eslint-disable-next-line
    switch (val.toString()) {
      case '[object File]':
      case '[object Map]':
      case '[object Set]': {
        return val.size === 0;
      }

      case '[object Object]': {
        for (const key in val) {
          if (has.call(val, key)) return false;
        }

        return true;
      }
    }
  }
  return false;
}

export default isEmpty;
