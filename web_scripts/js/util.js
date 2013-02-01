/**
 * @preserve Copyright (c) 2013 David Benjamin and Alan Huang
 * Use of this source code is governed by an MIT-style license that
 * can be found at
 * https://github.com/davidben/webathena
 */
// Only place in first file of each bundle.

function log(arg) {
    if (typeof console != "undefined" && console.log)
        console.log(arg);
}

if (!Object.create) {
    Object.create = function (o) {
        if (arguments.length > 1) {
            throw new Error('Object.create implementation only accepts the first parameter.');
        }
        function F() {}
        F.prototype = o;
        return new F();
    };
}

if (!window.atob || !window.btoa) {
    (function() {
        // Bleh. At least there's no other need for this thing.
        var sjcl_byteString = {
            /** Convert from a bitArray to a byte string. */
            fromBits: function (arr) {
                var out = "", bl = sjcl.bitArray.bitLength(arr), i, tmp;
                for (i=0; i<bl/8; i++) {
                    if ((i&3) === 0) {
                        tmp = arr[i/4];
                    }
                    out += String.fromCharCode(tmp >>> 24);
                    tmp <<= 8;
                }
                return out;
            },

            /** Convert from a byte string to a bitArray. */
            toBits: function (str) {
                var out = [], i, tmp=0;
                for (i=0; i<str.length; i++) {
                    tmp = tmp << 8 | str.charCodeAt(i);
                    if ((i&3) === 3) {
                        out.push(tmp);
                        tmp = 0;
                    }
                }
                if (i&3) {
                    out.push(sjcl.bitArray.partial(8*(i&3), tmp));
                }
                return out;
            }
        };

        window.atob = function(a) {
            return sjcl_byteString.fromBits(sjcl.codec.base64.toBits(a));
        };
        window.btoa = function(b) {
            return sjcl.codec.base64.fromBits(sjcl_byteString.toBits(b));
        };
    })();
}

// This is too useful to not polyfill.
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal
            // IsCallable function
            throw new TypeError("Not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                                     ? this
                                     : oThis,
                                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
