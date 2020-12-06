# Advent of Code Helper

---


## DISCLAIMER - PLEASE READ

I take no responsibility if you submit wrong answers or get timed out.
This does not mean that it doesn't work, it just means that I am not
responsible if anything happens by misuse. I use this personally, and
it works for me, so I decided to clean it up and share it. If you have 
any problems or suggestions please feel free to open up an issue or 
submit a pull request. If the author of Advent of Code wishes for this
package to be taken down due to abuse or spam then I will be happy to
oblige.

There is a mandatory 5-second cooldown between sending the same request
twice in order to attempt to reduce the stress. Note that this classes 
[getQuestionHTML](#getquestionhtmlpart-number-day-number-year-number-promisestring), [getQuestionMarkdown](#getquestionmarkdownpart-number-day-number-year-number-promisestring) and [getQuestionPlaintext](#getquestionplaintextpart-number-day-number-year-number-promisestring)
into one cooldown as this is essentially the same request but is just
handled differently. If you wish to get two or all three at once, request [getQuestionHTML](#getquestionhtmlpart-number-day-number-year-number-promisestring)
and then pass the output through 


## How to get session token

---

Within your browser, navigate to the [Advent of Code site](https://adventofcode.com),
[open dev tools](#how-to-open-dev-tools) and go to the tab labeled `Network`.
Load any Advent of Code page, click on the request for that page and look at
the `Request` header. It should contain a string that looks like `sessions=`
and then a bunch of characters. Everything after the `=` is your session token.


## How to open dev tools

---
 
* [Safari](https://support.apple.com/en-nz/guide/safari/sfri20948/mac)
* Firefox - Shortcut for `Network` tab
  * Windows/Linux `Control + Shift + E`
  * Max `Command + Shift + E`
* Firefox/Chrome - Shortcut for last tab
    * Windows/Linux `Control + Shift + I`
    * Max `Command + Shift + I`


## Installation

---

Using `npm`
> npm install aoc-helper

Using `yarn`
> yarn add aoc-helper


## Example

---

In order to submit, get input or check Part 2 of questions, put your
session token line 20 of `/example/index.js`

Run example using `npm`
> npm run example

Run example using `yarn`
> yarn run example

Example code
```javascript
const {AoCHelper} = require('../lib');
const helper = new AoCHelper('Your token here');

helper.getQuestionPlaintext(1, 5)
        .then(res => console.log(`\n\nThis Year Day 5 Part 2 Question:\n${res}`))
        .catch(console.log);

helper.getInput()
        .then(res => console.log(`\n\nToday's Input: \n${res}`))
        .catch(console.log);

helper.submitAnswer(25245345, 2, 2, 2020)
        .then(console.log)
        .catch(console.log);
```


## Documentation

---

* **[AoCHelper](#aochelper)**
    * [submitAnswer](#submitansweranswer-stringnumber-part-number-day-number-year-number-maxiterations-number-fallbackcooldown-number-promisestring)
    * [getInput](#getinputday-number-year-number-promisestring)
    * [getQuestionHTML](#getquestionhtmlpart-number-day-number-year-number-promisestring)
    * [getQuestionMarkdown](#getquestionmarkdownpart-number-day-number-year-number-promisestring)
    * [getQuestionPlaintext](#getquestionplaintextpart-number-day-number-year-number-promisestring)
    * [invalidateCache](#invalidatecache-void)
    * static [htmlToMarkdown](#static-htmltomarkdownhtml-string-string)
    * static [htmlToPlaintext](#static-htmltoplaintexthtml-string-string)


## AoCHelper

---

All functions that take `part`, `day` or `year` can be omitted or 
passed as `null` and they will default to the values below

 * `part` - 1
 * `day` - The current day 1 hour ahead of EST
 * `year` - The current year if the current month is December, else last year


<br/>

### new AoCHelper(session: string);

---

**Arguments**

* `session` - Your session token included in all Advent of Code requests 


<br/>

### submitAnswer(answer: string|number, part?: number, day?: number, year?: number, maxIterations?: number, fallbackCooldown?: number): Promise\<string>

---

**Arguments**

* `answer` - Answer to question
* `part` - The specific part of the question, Should only be 1 or 2
* `day` - Day of the question to submit
* `year` - Year of the question to submit
* `maxIteration - Default:5` - If this is set 1 or less it will not try to resubmit if you've been timed out
* `fallbackCooldown - Default:10000` - The cooldown to wait before resubmitting if you've been timed out, but the timeout could not be detected/parsed

**Description**

* Submits an answer for a specified day and part, if you've been submitting too quickly and get a cooldown it will detect how long it is and resubmit after the cooldown has finished. maxIterations and defaultCooldown are used as fallbacks where the cooldown cannot be detected/parsed.


<br/>

### getInput(day?: number, year?: number): Promise\<string>

---

**Arguments**

* `day` - Day of the input to get
* `year` - Year of the input to get

**Description**

* Fetches the input of the specified day


<br/>

### getQuestionHTML(part?: number, day?: number, year?: number): Promise\<string>

---

**Arguments**

* `part` - Which part of the question to get
* `day` - Day of the question
* `year` - Year of the question

**Description**

* Fetches the question raw HTML


<br/>

### getQuestionMarkdown(part?: number, day?: number, year?: number): Promise\<string>

---

**Arguments**

* `part` - Which part of the question to get
* `day` - Day of the question
* `year` - Year of the question

**Description**

* Fetches the question HTML then uses [Turndown](https://github.com/domchristie/turndown) to convert it to HTML which can be saved and viewed through an IDE or such


<br/>

### getQuestionPlaintext(part?: number, day?: number, year?: number): Promise\<string>

---

**Arguments**

* `part` - Which part of the question to get
* `day` - Day of the question
* `year` - Year of the question

**Description**

* Fetches the question HTML then strips all the HTML tabs so that which can be saved and viewed easier. If you use an IDE that supports viewing markdown, it's better to use [getQuestionMarkdown](#getquestionmarkdownpart-number-day-number-year-number-promisestring) as removing tags may occasionally break line breaks.


<br/>

### invalidateCache(): void

---

**Description**

* Invalidates the input cache, please never use this unless you absolutely need to.


<br/>

### static htmlToMarkdown(html: string): string

---

**Arguments**

* `html` - HTML input to convert

**Description**

* Converts HTML to Markdown using [Turndown](https://github.com/domchristie/turndown)

<br/>

### static htmlToPlaintext(html: string): string

---

**Arguments**

* `html` - HTML input to convert

**Description**

* Strips HTML tags from a given string
