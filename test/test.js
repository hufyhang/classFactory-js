/* global describe, it */
'use strict';
var should = require('should');
var classFactory = require('../classFactory.js');

var Person, LifeForm, Programmer;

describe('classFactory', function () {
  it('should by imported by require', function () {
    should.exist(classFactory);
  });

  describe('#classFactory', function () {
    it('should throw error if received no parameters', function () {
      should.throws(function () {
        classFactory();
      });
    });

    it('should creates and returns a class object', function () {
      Person = classFactory(function () {
        this.constructor = function (name) {
          this.name = name;
        };

        this.getName = function () {
          return this.name;
        };

        this.setName = function (name) {
          this.name = name;
          return this;
        };
      });

      should.notEqual(Person, undefined);
    });

    it('should creates abstract method/class', function () {
      LifeForm = classFactory(function () {
        this.abstract.toString = function () {};
      });

      should.notEqual(LifeForm, undefined);
    });

    it('should supports (multiple) inheritance', function () {
      should.doesNotThrow(function () {
        Programmer = classFactory([Person, LifeForm], function (P, L) {
          this.constructor = function (name, language) {
            P.call(this, name);
            this.language = language;
          };

          this.getLanguage = function () {
            return this.language;
          };

          this.toString = function () {
            return this.getName() + ' loves ' + this.getLanguage();
          };
        });
      });
    });

    it('should throw error if not all abstract methods are implemented', function () {
      should.throws(function () {
        Programmer = classFactory([Person, LifeForm], function (P, L) {
          this.constructor = function (name, language) {
            P.call(this, name);
            this.language = language;
          };

          this.getLanguage = function () {
            return this.language;
          };
        });
      });
    });

  });

  describe('class object', function () {
    var programmer;
    it('should throw errors when creating abstract class', function () {
      should.throws(function () {
        LifeForm.create();
      });
    });

    it('should create instance', function () {
      programmer = Programmer.create('Someone', 'JavaScript');
      should.notEqual(programmer, undefined);
    });

    it('should detect parents via #instanceOf', function () {
      should.equal(programmer.instanceOf(Programmer), true);
      should.equal(programmer.instanceOf(Person), true);
      should.equal(programmer.instanceOf(LifeForm), true);
    });

    it('should let each method works correctly', function () {
      var str = 'Someone loves JavaScript';
      should.equal(programmer.toString(), str);
    });
  });
});
