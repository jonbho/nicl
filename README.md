nicl -- Node.js Interactive Command Line
========================================

INSTALLING
----------

### via npm
* `npm install nicl`
* Should be that simple.

### from source
* `git clone git://github.com/jonbho/nicl.git`
* `cd nicl`
* `npm install`

You may need to install `fibers` separately (npm install fibers).

RATIONALE
----------
**Nicl** helps you write a JavaScript interactive command-line application in the "classic" style using Node.js.
By "classic" style, I mean a linear sequence of code that can ask the user for input and print results in
the order it wants. This is easy by default in most programming languages, but it is hard in JavaScript,
since its native environment (the browser) is not conducive to command-line aplications at all. And the
de-facto standard for non-browser JavaScript is Node.js, allows command-line operation, but it is designed
as an event-driven framework that doesn't in principle allow you to write sequential code interacting with the
users. **Nicl** adds support for sequential interactive code running inside Node.js.

Many IDEs only understad "browser JavaScript" and "Node.js JavaScript". If you want to benefit from
their advantages foro your JavaScript project (autocompletion, debugging, etc...), your project had
better be one of those two. 

The main initial goal is educational. Using **nicl** and a free IDE like NetBeans, a beginner can start writing
simple command-line applications in JavaScript, using code completion and the debugger, and complete many
exercises until they understand variables, conditions, loops, function-calls, etc...

EXAMPLE
-------
Here is a sample application using **nicl** to ask the user a couple questions and respond politely, in sequence:

```javascript
var nicl = require("nicl");

function main() {
    nicl.printLine("Hello, what is your name?");
    var name = nicl.readLine();
    nicl.printLine("Great to meet you, " + name + "!");
    
    nicl.printLine("Where are you?");
    var place = nicl.readLine();
    nicl.printLine("Good. Hope it's all fine in " + place + "!");
    
    process.exit(0);
}
        
nicl.run(main);
```

Note how you need to run the code that uses **nicl** by calling `nicl.run()` and passing it the function to execute.
Exiting the program needs to be done explicitly if so desired, as Node.js won't by default close the application
until explicitly told to do so.

SUPPORTED ENVIRONMENTS
----------------------
**Nicl** has been tested to work in OS X 10.10 Yosemite, both inside the NetBeans IDE console, and from the command line,
by using `node main.js` to launch a program. Beware, it won't work properly inside the Node REPL, since
the REPL sets input in "raw" mode (input processed at the keystroke level), and **nicl** is designed for cooked mode
(linewise input).

TECHNICAL DETAILS
-----------------
**Nicl** builds on [node-fibers](https://github.com/laverdet/node-fibers)
by [Marcel Laverdet](https://github.com/laverdet), a coroutine-style library that allows adding suspension
and resumption sematincs inside a single-threaded, event-driven library like Node.js, where blocking I/O
is in principle not possible.


FUTURE EVOLUTION
----------------
Support for raw input (keypress-level) will probably be added in the future.

LEGAL
-----
(c) January 2016 Jon Beltran de Heredia ([jonbho](http://jonbho.net)). Licensed under the GPL v2.0 license.
