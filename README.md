### Object.classFactory [![Build Status](https://travis-ci.org/hufyhang/classFactory-js.svg?branch=master)](https://travis-ci.org/hufyhang/classFactory-js)

An ES6-inspired API to create "classes" in ES5.

#### Features

+ Class
+ (Multiple) Inheritance
+ Abstract method/class
+ Getters & setters

#### [Object.]classFactory([parents, ] definition)

__Returns__ a class (i.e. function).

+ `parents`: __[optional]__ Parent classes (i.e. function) in the form of an array.
+ `definition`: A callback function used to create the class.

##### Class Object

The class obejct created by `classFactory` contains the follows properties:

+ `constructor`: The class constructor.
+ `definition`: The function used to define the class.
+ `parents`: An array of parent class object.
+ `abstract`: All abstract methods.
+ `get`: Getters.
+ `set`: Setters.
+ `create(...)`: The method for creating instances.

##### Class Instance

Each instance of class contains a `.instanceOf(classObject)` function, which allows to check if an object is the instance of a class.

#### Examples

##### In browser:

~~~js
var Person = Object.classFactory(function () {
        this.constructor = function (name, age) {
            this.name = name;
            this.age = age;
        };

        this.getName = function () {return this.name;};
        this.getAge = function () {return this.age;};
    });

var guy = Person.create('Someone', 10);
guy.getName(); // Someone
guy.getAge(); // 10

var Coder = Object.classFactory([Person, AnotherClass], function (P) { // P becomes the shorthand of Person
        this.constructor = function (name, age, language) {
            P.call(this, name, age);
            this.language = language;
        };

        this.getLanguage = function () {return this.language;};
    });

var monkey = Coder.create('Code Monkey', 20, 'JavaScript');
monkey.getName(); // Code Monkey
monkey.getAge(); // 20
monkey.getLanguage(); // JavaScript

monkey.instanceOf(Coder); // true
monkey.instanceOf(Person); // true
~~~

##### In Node.js:

You can import classFactory by, for example, `var classFactory = require('class-factory-js');`. Then `var Person = classFactory(...)`.

#### Getters & Setters

Getters & setters can be defined through `this.get` and `this.set` in the class definition callback function.

For example:

~~~js
var Person = Object.classFactory(function () {
  this.constructor = function (name, age) {
    this.name = name;
    this.age = age;
  };

  // Define a getter
  this.get.info = function () {
    return this.name + ' -- ' + this.age;
  };

  // Define a setter
  this.set.info = function (val) {
    this.name = val;
  };
});

var p = Person.create('Superhero', 1);
p.info; // 'Superhero -- 1'
p.info = 'Superman';
p.name; // 'Superman'
~~~

#### Abstract methods

The below example shows how to define and implement abstract method. All _abstract_ methods should be defined under `this.abstract` property.

~~~js
var Person = Object.classFactory(function () {
  this.constructor = function (name, age) {
    this.name = name;
    this.age = age;
  };

  this.abstract.getName = function () {};
  this.abstract.setName = function (name) {};
});

Person.create() // TypeError: Person is an abstract class.

var Boy = Object.classFactory([Person], function (P) {
  this.constructor = function (name, age) {
    P.call(this, name, age);
  };

  this.getName = function () {
    return this.name;
  };

  this.setName = function (name) {
    this.name = name;
    return this;
  };

  this.toString = function () {
    return this.name + ' is now ' + this.age + '-year old.';
  };
});

var boy = Boy.create('Pretty Boy', 1);
~~~

Notice that a `TypeError` will be thrown if not all the abstract methods are implemented.

#### License

MIT