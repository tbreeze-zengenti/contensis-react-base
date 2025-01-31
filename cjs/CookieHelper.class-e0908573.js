'use strict';

const LOGIN_COOKIE = 'ContensisCMSUserName';
const REFRESH_TOKEN_COOKIE = 'RefreshToken';
const findLoginCookies = cookies => typeof cookies === 'object' ? Object.fromEntries(Object.entries(cookies).filter(([name]) => [LOGIN_COOKIE, REFRESH_TOKEN_COOKIE].includes(name))) : cookies;

/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module exports.
 * @public
 */

var parse_1 = parse;
var serialize_1 = serialize;

/**
 * Module variables.
 * @private
 */

var __toString = Object.prototype.toString;

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */

var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */

function parse(str, options) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var opt = options || {};
  var dec = opt.decode || decode;

  var index = 0;
  while (index < str.length) {
    var eqIdx = str.indexOf('=', index);

    // no more cookie pairs
    if (eqIdx === -1) {
      break
    }

    var endIdx = str.indexOf(';', index);

    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(';', eqIdx - 1) + 1;
      continue
    }

    var key = str.slice(index, eqIdx).trim();

    // only assign once
    if (undefined === obj[key]) {
      var val = str.slice(eqIdx + 1, endIdx).trim();

      // quoted values
      if (val.charCodeAt(0) === 0x22) {
        val = val.slice(1, -1);
      }

      obj[key] = tryDecode(val, dec);
    }

    index = endIdx + 1;
  }

  return obj;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */

function serialize(name, val, options) {
  var opt = options || {};
  var enc = opt.encode || encode;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!fieldContentRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;

  if (null != opt.maxAge) {
    var maxAge = opt.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + Math.floor(maxAge);
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    var expires = opt.expires;

    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + expires.toUTCString();
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.partitioned) {
    str += '; Partitioned';
  }

  if (opt.priority) {
    var priority = typeof opt.priority === 'string'
      ? opt.priority.toLowerCase()
      : opt.priority;

    switch (priority) {
      case 'low':
        str += '; Priority=Low';
        break
      case 'medium':
        str += '; Priority=Medium';
        break
      case 'high':
        str += '; Priority=High';
        break
      default:
        throw new TypeError('option priority is invalid')
    }
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */

function decode (str) {
  return str.indexOf('%') !== -1
    ? decodeURIComponent(str)
    : str
}

/**
 * URL-encode value.
 *
 * @param {string} val
 * @returns {string}
 */

function encode (val) {
  return encodeURIComponent(val)
}

/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */

function isDate (val) {
  return __toString.call(val) === '[object Date]' ||
    val instanceof Date
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}

function hasDocumentCookie() {
    const testingValue = typeof global === 'undefined'
        ? undefined
        : global.TEST_HAS_DOCUMENT_COOKIE;
    if (typeof testingValue === 'boolean') {
        return testingValue;
    }
    // Can we get/set cookies on document.cookie?
    return typeof document === 'object' && typeof document.cookie === 'string';
}
function parseCookies(cookies) {
    if (typeof cookies === 'string') {
        return parse_1(cookies);
    }
    else if (typeof cookies === 'object' && cookies !== null) {
        return cookies;
    }
    else {
        return {};
    }
}
function readCookie(value, options = {}) {
    const cleanValue = cleanupCookieValue(value);
    if (!options.doNotParse) {
        try {
            return JSON.parse(cleanValue);
        }
        catch (e) {
            // At least we tried
        }
    }
    // Ignore clean value if we failed the deserialization
    // It is not relevant anymore to trim those values
    return value;
}
function cleanupCookieValue(value) {
    // express prepend j: before serializing a cookie
    if (value && value[0] === 'j' && value[1] === ':') {
        return value.substr(2);
    }
    return value;
}

class Cookies {
    constructor(cookies, defaultSetOptions = {}) {
        this.changeListeners = [];
        this.HAS_DOCUMENT_COOKIE = false;
        this.update = () => {
            if (!this.HAS_DOCUMENT_COOKIE) {
                return;
            }
            const previousCookies = this.cookies;
            this.cookies = parse_1(document.cookie);
            this._checkChanges(previousCookies);
        };
        const domCookies = typeof document === 'undefined' ? '' : document.cookie;
        this.cookies = parseCookies(cookies || domCookies);
        this.defaultSetOptions = defaultSetOptions;
        this.HAS_DOCUMENT_COOKIE = hasDocumentCookie();
    }
    _emitChange(params) {
        for (let i = 0; i < this.changeListeners.length; ++i) {
            this.changeListeners[i](params);
        }
    }
    _checkChanges(previousCookies) {
        const names = new Set(Object.keys(previousCookies).concat(Object.keys(this.cookies)));
        names.forEach((name) => {
            if (previousCookies[name] !== this.cookies[name]) {
                this._emitChange({
                    name,
                    value: readCookie(this.cookies[name]),
                });
            }
        });
    }
    _startPolling() {
        this.pollingInterval = setInterval(this.update, 300);
    }
    _stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
    }
    get(name, options = {}) {
        if (!options.doNotUpdate) {
            this.update();
        }
        return readCookie(this.cookies[name], options);
    }
    getAll(options = {}) {
        if (!options.doNotUpdate) {
            this.update();
        }
        const result = {};
        for (let name in this.cookies) {
            result[name] = readCookie(this.cookies[name], options);
        }
        return result;
    }
    set(name, value, options) {
        if (options) {
            options = Object.assign(Object.assign({}, this.defaultSetOptions), options);
        }
        else {
            options = this.defaultSetOptions;
        }
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        this.cookies = Object.assign(Object.assign({}, this.cookies), { [name]: stringValue });
        if (this.HAS_DOCUMENT_COOKIE) {
            document.cookie = serialize_1(name, stringValue, options);
        }
        this._emitChange({ name, value, options });
    }
    remove(name, options) {
        const finalOptions = (options = Object.assign(Object.assign(Object.assign({}, this.defaultSetOptions), options), { expires: new Date(1970, 1, 1, 0, 0, 1), maxAge: 0 }));
        this.cookies = Object.assign({}, this.cookies);
        delete this.cookies[name];
        if (this.HAS_DOCUMENT_COOKIE) {
            document.cookie = serialize_1(name, '', finalOptions);
        }
        this._emitChange({ name, value: undefined, options });
    }
    addChangeListener(callback) {
        this.changeListeners.push(callback);
        if (this.HAS_DOCUMENT_COOKIE && this.changeListeners.length === 1) {
            if (typeof window === 'object' && 'cookieStore' in window) {
                window.cookieStore.addEventListener('change', this.update);
            }
            else {
                this._startPolling();
            }
        }
    }
    removeChangeListener(callback) {
        const idx = this.changeListeners.indexOf(callback);
        if (idx >= 0) {
            this.changeListeners.splice(idx, 1);
        }
        if (this.HAS_DOCUMENT_COOKIE && this.changeListeners.length === 0) {
            if (typeof window === 'object' && 'cookieStore' in window) {
                window.cookieStore.removeEventListener('change', this.update);
            }
            else {
                this._stopPolling();
            }
        }
    }
}

const COOKIE_VALID_DAYS = 1; // 0 = Session cookie

// CookieHelper is a class that takes in and lets us pass around the methods provided
// by `useCookie` react hook in backend code that is connected to the universal-cookies
// instance created in SSR middleware (and provides browser cookies)
class CookieHelper {
  get raw() {
    return this.cookies;
  }
  get cookie() {
    return this.set ? this : this.fallback;
  }
  constructor(cookies, setCookie, removeCookie, updateCookies) {
    this.cookies = void 0;
    this.set = void 0;
    this.remove = void 0;
    this.update = void 0;
    this.fallback = void 0;
    // Add fallback methods if global cookies not supplied
    if (!cookies || !setCookie || !removeCookie) this.fallback = new Cookies();
    this.cookies = cookies || this.fallback.getAll();
    if (setCookie) this.set = setCookie;
    if (removeCookie) this.remove = removeCookie;
    if (updateCookies) this.update = updateCookies;
  }
  GetCookie(name) {
    const cookie = this.cookies[name];
    if (typeof cookie === 'undefined') {
      return null;
    }
    return cookie;
  }
  SetCookie(name, value, maxAgeDays = COOKIE_VALID_DAYS) {
    // update local cookies object as this is provided as a clone of `req.universalCookies`
    this.cookies[name] = value;

    // call the passed setCookie method so we can update the `universal-cookie` instance
    // with the change listener attached so the cookies can be set in SSR response
    if (maxAgeDays === 0) this.cookie.set(name, value);else this.cookie.set(name, value, {
      expires: addDays(new Date(), maxAgeDays),
      path: '/'
    });
  }
  DeleteCookie(name) {
    // update local cookies object as this is provided as a clone of `req.universalCookies`
    delete this.cookies[name];
    this.cookie.remove(name, {
      path: '/'
    });
  }
}
const addDays = (date = new Date(), days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

exports.CookieHelper = CookieHelper;
exports.Cookies = Cookies;
exports.LOGIN_COOKIE = LOGIN_COOKIE;
exports.REFRESH_TOKEN_COOKIE = REFRESH_TOKEN_COOKIE;
exports.findLoginCookies = findLoginCookies;
//# sourceMappingURL=CookieHelper.class-e0908573.js.map
