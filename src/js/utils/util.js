var $ = require('jquery');
var moment = require('moment-timezone');

var util = {

    contains: function(list, val) {
        for (k = 0; k < list.length; k++) {
            if (val == list[k]) {
                return 1;
            }
        }
        return 0;
    },

    baseUrl: function() {
        var base_url = location.protocol + '//' + location.host + location.pathname;
        return base_url;
    },

    nowTimestamp: function() {
        // Millis
        return Date.now();
    },

    printDateObj: function(date, _timezone, opts) {
        if (_timezone && moment) {
            // Using moment.js to print local date/times
            var dt = moment.tz(date.getTime(), _timezone);
            if(opts && opts['_with_time']){
                return dt.format("YYYY-MM-DD HH:mm");
            } else{
                return dt.format("YYYY-MM-DD");
            }
        } else {
            if (date != null) {
                var d = date.getDate();
                var month = date.getMonth() + 1;
                var day = d;
                if (!opts || !opts.no_leading_zero) {
                    day = day<10? '0'+day:''+day;
                    if (month < 10) month = '0'+month;
                }
                return date.getFullYear()+"-"+month+"-"+day;
            } else return "--";
        }
    },

    printDate: function(ts, _with_time, _numeric, _timezone) {
        // Takes ts in ms
        var numeric = _numeric == null ? false : _numeric;
        var with_time = _with_time == null ? true : _with_time;
        var timezone = _timezone || "UTC";
        if (ts == null) return "";
        // Using moment.js to print local date/times
        var dt = moment.tz(parseInt(ts), timezone);
        if (with_time) return dt.format("YYYY-MM-DD H:mm:ss z");
        else return dt.format("YYYY-MM-DD");
    },

    timestamp: function() {
        // Seconds
        return parseInt(new Date().getTime() / 1000);
    },

    printDateOnly: function(ts, numeric) {
        return util.printDate(ts, false, numeric);
    },

    printDateNumeric: function(ts) {
        return util.printDate(ts, false, true);
    },

    uppercaseSlug: function(str) {
        return str.replace(/[^A-Z0-9]+/ig, "_").toUpperCase();
    },

    truncate: function(s, _chars) {
        var chars = _chars || 30;
        if (s.length > chars) return s.substring(0, _chars) + '...';
        else return s;
    },

    getParameterByName: function(name, _default) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? _default || "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },

    getHash: function() {
        return window.location.hash.substr(1);
    },

    randomId: function(length) {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    doOnKeypress: function(keycodes, fn) {
        if (!(keycodes instanceof Array)) keycodes = [keycodes];
        $(document).keyup(function(e) {
            if (keycodes.indexOf(e.keyCode) > -1 && fn) { fn(); }
        });
    },

    basicCompare: function(o1, o2) {
        for (var val in o1) {
            if (o1.hasOwnProperty(val)) {
                if (o2[val] === undefined || o1[val] != o2[val]) return false;
            }
        }
        for (var val in o2) {
            if (o2.hasOwnProperty(val)) {
                if (o1[val] === undefined || o1[val] != o2[val]) return false;
            }
        }
        return true;
    },

    applySentenceCase: function(str) {
        return str.replace(/.+?[\.\?\!](\s|$)/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    },

    stripNonNumbers: function(text) {
        return text.replace(/[^0-9]*/g, '');
    },

    stripSpaces: function(text) {
        return text.replace(/ /g,'');
    },

    strip: function(text) {
        return String(text).replace(/^\s+|\s+$/g, '');
    },

    withKeyboardShortcut: function(s, character) {
        let uppercaseIndex = s.indexOf(character.toUpperCase())
        let lowercaseIndex = s.indexOf(character.toLowerCase())
        let index = uppercaseIndex > -1 ? uppercaseIndex : lowercaseIndex
        if (index > -1) {
            return s.substr(0, index) + "[" + s[index] + "]" + s.substr(index+1);
        } else return s
    },

    arrEquals: function(array, array2) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (array2.length != array.length)
            return false;

        for (var i = 0, l=array2.length; i < l; i++) {
            // Check if we have nested arrays
            if (array2[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!array2[i].equals(array[i]))
                    return false;
            }
            else if (array2[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    },

    stripSymbols: function(text) {
        return text.replace(/[^A-Za-z 0-9]*/g, '');
    },

    randomInt: function(min, max) {
        return Math.floor((Math.random() * max) + min);
    },

    clone: function(obj) {
        var o2 = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                o2[key] = obj[key];
            }
        }
        return o2;
    },

    getRandomColor: function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },

    stripPointZero: function(s) {
        var pz = '.0';
        var hasPointZero = s.indexOf(pz, s.length - pz.length) !== -1;
        if (hasPointZero) return s.replace(pz, '');
        else return s;
    },

    average: function(arr) {
        if (arr.length > 0) {
            var sum = 0;
            for(var i = 0; i < arr.length; i++){
                sum += arr[i];
            }
            return sum / arr.length;
        } else return 0;
    },

    capitalize: function(s) {
        if (s==null) return null;
        else {
            s = s.toLowerCase();
            return s.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
        }
    },

    catchJSErrors: function() {
        window.onerror = function(msg, url, line, col, error) {
           // Note that col & error are new to the HTML 5 spec and may not be
           // supported in every browser.  It worked for me in Chrome.
           var extra = !col ? '' : '\ncolumn: ' + col;
           extra += !error ? '' : '\nerror: ' + error;

           // You can view the information in an alert to see things working like this:
           alert("An error has occurred. Share this with the Echo Development team for assistance: " + msg + "\nurl: " + url + "\nline: " + line + extra);

           // TODO: Report this error via ajax so you can keep track
           //       of what pages have JS issues

           var suppressErrorAlert = true;
           // If you return true, then error alerts (like in older versions of
           // Internet Explorer) will be suppressed.
           return suppressErrorAlert;
        };
    },

    toggleInList: function(list, item) {
        var i = list.indexOf(item);
        if (i > -1) list.splice(i, 1);
        else list.push(item);
        return list;
    },

    stringToColor: function(str) {
        // str to hash
        for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
        // int/hash to hex
        for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
        return colour;
    },

    lookupDict: function(itemlist, _keyprop) {
        var keyprop = _keyprop || 'id';
        var lookup = {}
        itemlist.forEach(function(item, i, arr) {
            lookup[item[keyprop]] = item;
        });
        return lookup;
    },

    flattenDict: function(dict) {
        var list = [];
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                list.push(dict[key]);
            }
        }
        return list;
    },

    fixedNumber: function(num, _decimals) {
        var decimals = _decimals == null ? 2 : _decimals;
        return parseFloat(Math.round(num * 100) / 100).toFixed(decimals);
    },

    numberWithCommas: function(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    },

    serializeObject: function(jqel) {
        var o = {};
        var a = jqel.serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    },

    type_check(value, type) {
        // Type is a string matching google visualization types
        // Returns value standardized to given type
        if (type == "number") value = parseFloat(value);
        return value;
    },

    removeItemsById: function(collection, id_list, _id_prop) {
        var id_prop = _id_prop || "id";
        return collection.filter(function(x) { return id_list.indexOf(x[id_prop]) == -1; } )
    },
    findItemById: function(collection, id, _id_prop) {
        var id_prop = _id_prop || "id";
        return collection.find(x => x && x[id_prop] === id);
    },
    findIndexById: function(collection, id, _id_prop) {
        var id_prop = _id_prop || "id";
        var ids = collection.map(function(x) {return (x != null) ? x[id_prop] : null; });
        return ids.indexOf(id);
    },

}

module.exports = util;