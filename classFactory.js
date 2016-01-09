'use strict';
( function (definition) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = definition;
  }
  else {
    Object.classFactory = definition;
  }
} )(

( function () {
  var hasOwn = Object.prototype.hasOwnProperty;

  function keys(o) {
    if (o === null || o === undefined) {
      return 0;
    }
    var res = [];
    for (var k in o) {
      res = res.concat(k);
    }
    return res;
  }

  function clone(o) {
    if (o === null || o === undefined || typeof o !== 'object') {
      return o;
    }
    var temp = o.constructor();
    for (var k in o) {
      if (hasOwn.call(o, k)) {
        temp[k] = clone(o[k]);
      }
    }
    return temp;
  }

  function extend(a, b) {
    for (var k in b) {
      a[k] = clone(b[k]);
    }
    return a;
  }

  return function classFactory(parents, define) {
      if (typeof parents !== 'function' &&
          Object.prototype.toString.call(parents) !== '[object Array]') {
        throw TypeError(parents + ' is neither a function nor an array');
      }

      if (typeof define !== 'function') {
        define = parents;
        parents = [];
      }

      // Make sure parents is an array.
      var supers = parents = [].concat(parents);

      try {
        parents = Array.prototype.map.call(parents, function (parent) {
          return parent.constructor;
        });
      } catch (e) {
        throw TypeError('Invalid parent function');
      }

      // Attach all parents of supers to obtain a complete 'parent' chain.
      for (var i = 0, l = supers.length; i !== l; ++i) {
        var tempSuper = supers[i].parents;
        for (var ii = 0, ll = tempSuper.length; ii !== ll; ++ii) {
          if (supers.indexOf(tempSuper[ii]) === -1) {
            supers = supers.concat(tempSuper[ii]);
          }
        }
      }

      var F,
        proto = {
          abstract: {},
          get: {},
          set: {}
        };

      define.apply(proto, parents);
      if (!hasOwn.call(proto, 'constructor')) {
        proto.constructor = function() {};
      }
      F = proto.constructor;

      for (var i = 0, l = parents.length; i !== l; ++i) {
        F.prototype = extend(F.prototype, parents[i].prototype);
      }

      for (var k in proto) {
        if (hasOwn.call(proto, k)) {
          F.prototype[k] = proto[k];
        }
      }

      F.prototype.instanceOf = function instanceOf(o) {
        return classObj !== o && supers.indexOf(o) === -1 ? false : true;
      };

      // Check if all abstract functions from parents are implemented.
      var p, methods = keys(proto);
      for (var i = 0, l = supers.length; i !== l; ++i) {
        p = supers[i];
        for (var ab in p.abstract) {
          if (methods.indexOf(ab) === -1 ||
              p.abstract[ab].length !== proto[ab].length) {
            throw TypeError('Abstract function ' + ab + ' is not properly implemented.');
          }
        }
      }


      // Class object
      var classObj = {
        abstract: proto.abstract,
        get: proto.get,
        set: proto.set,
        constructor: F,
        definition: define,
        parents: supers,
        create: function () {
          // If try to instantiate an abstract class, throw error.
          if (keys(this.abstract).length > 0) {
            throw TypeError(this + ' is an abstract class.');
          }

          var args = Array.prototype.slice.call(arguments);
          args = [F].concat(args);
          var o = new (Function.prototype.bind.apply(F, args))();
          // Define getters and setters.
          var properties = [];
          properties = properties.concat(keys(this.get));
          // First, get all getters and setters' names.
          var setKeys = keys(this.set);
          var key;
          var i, l;
          for (i = 0, l = setKeys.length; i !== l; ++i) {
            key = setKeys[i];
            if (properties.indexOf(key) === -1) {
              properties = properties.concat(key);
            }
          }
          // Then, iterate through all the names and define properties.
          var p;
          for (i = 0, l = properties.length; i !== l; ++i) {
            p = properties[i];
            Object.defineProperty(o, p, {
              get: this.get[p] || function () { return this; },
              set: this.set[p] || function () { return this; }
            });
          }

          return o;
        }
      };

      return classObj;
    };

} )()

);

