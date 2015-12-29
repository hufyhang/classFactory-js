### Object.classFactory

An ES6-inspired API to create "classes" in ES5.

#### [Object.]classFactory([parents, ] definition)

__Returns__ a class (i.e. function).

+ `parents`: __[optional]__ Parent classes (i.e. function) in the form of an array.
+ `definition`: A callback function used to create the class.

##### Class Object

The class obejct created by `classFactory` contains the follows properties:

+ `constructor`: The class constructor.
+ `definition`: The function used to define the class.
+ `parents`: An array of parent class object.
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

#### License

MIT