### Object.classFactory

An ES6-inspired API to create "classes" in ES5.

#### Object.classFactory([parent, ] definition)

__Returns__ a class (i.e. function).

+ `parent`: __[optional]__ Parent class (i.e. function).
+ `definition`: A callback function used to create the class.

#### Examples

~~~js
var Person = Object.classFactory(function () {
        this.constructor = function (name, age) {
            this.name = name;
            this.age = age;
        };

        this.getName = function () {return this.name;};
        this.getAge = function () {return this.age;};
    });

var guy = new Person('Someone', 10);
guy.getName(); // Someone
guy.getAge(); // 10

var Coder = Object.classFactory(Person, function (P) { // P becomes the shorthand of Person
        this.constructor = function (name, age, language) {
            P.call(this, name, age);
            this.language = language;
        };

        this.getLanguage = function () {return this.language;};
    });

var monkey = new Coder('Code Monkey', 20, 'JavaScript');
monkey.getName(); // Code Monkey
monkey.getAge(); // 20
monkey.getLanguage(); // JavaScript
~~~

#### License

MIT