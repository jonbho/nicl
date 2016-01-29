/*
    nicl - Node.js Interactive Command Line

    Linear, interactive command-line support for Node.js. Allows you to write
    software using a classic-style main() function, calling nicl.printline()
    and nicl.readLine() to interact with the user. Turns Javascript + Node.js
    into a good, simple learning environment for beginners.

    It uses Fibers (https://github.com/laverdet/node-fibers) by Marcel Laverdet
    to simulate blocking, linear execution in an event-based environment like
    Node.js.

    Copyright (C) 2016 Jon Beltran de Heredia

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

// Other modules used
var Fiber = require("fibers");

// Buffer to store input while not requested, and fiber to call when there's something
var initialized = false;
var inputBuffer = "";
var inputListenerFiber = null;

/* This function sets up input processing such that whatever is received via stdin
 * is stored in the inputBuffer, and if the main "nicl'd" code fiber is suspended
 * waitin for input, it will be woken up to resume its process */
function ensureInitialSetup() {
    if (!initialized) {
        initialized = true;
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", function (text) {
            // Store input in buffer
            inputBuffer += text;

            // After input received, if main fiber was waiting, wake it up
            if (inputListenerFiber)
                inputListenerFiber.run();
        });
    }
}

/* This function is called from the "main" nicl'd code to ask for a line of input.
 * If there is input available in the buffer from previously read data, it will
 * remove it from the buffer and return it to the caller directly. If there is
 * no input available, it will "suspend" this fiber of execution, to be woken
 * back up when input arrives, and continue running the main "nicl'd" code. */
function readLine() {
    // Ensure asynchronous operation is set up
    ensureInitialSetup();

    // Set up listener for when input arrives (it just continues on the next step)
    inputListenerFiber = Fiber.current;

    // If there isn't any, terminate this fiber until there is
    if (inputBuffer === "") {
        // Register a listener to continue the work
        Fiber.yield();
    }

    // There was input, remove listener
    inputListenerFiber = null;

    // Take first line of input and return it to caller
    var ix = inputBuffer.indexOf("\n");
    var ixAfterLine = ix + 1;
    if (ix === -1) {
        ix = inputBuffer.length;
        ixAfterLine = ix;
    }
    var firstLine = inputBuffer.slice(0, ix);
    inputBuffer = inputBuffer.slice(ixAfterLine);

    return firstLine;
}

/* Simple wrapper so that all command-line interaction can be done via nicl */
function printLine(str) {
    console.log(str);
}

/* This is the main entry point, pass-in the function that uses readLine()
 * so that it is executed "linearly", as if readLine() was blocking I/O, by
 * the magic of suspending/resuming fibers depending on the availability of input. */
function run(fn) {
    Fiber(fn).run();
}

/* Export all the user-available functions */
exports.readLine  = readLine;
exports.printLine = printLine;
exports.run       = run;
