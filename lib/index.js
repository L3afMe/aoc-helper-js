/******************************************************************************
 *                                                                            *
 * aoc-helper - index.js                                                      *
 * Copyright (C) 2020 L3af                                                    *
 *                                                                            *
 * This program is free software: you can redistribute it and/or modify it    *
 * under the terms of the GNU General Public License as published by the      *
 * Free Software Foundation, either version 3 of the License, or (at your     *
 * option) any later version.                                                 *
 *                                                                            *
 * This program is distributed in the hope that it will be useful, but        *
 * WITHOUT ANY WARRANTY; without even the implied warranty of                 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the GNU General  *
 * Public License for more details.                                           *
 *                                                                            *
 * You should have received a copy of the GNU General Public License          *
 * along with this program. If not, see <https://www.gnu.org/licenses/>.      *
 *                                                                            *
 ******************************************************************************/

const {EventEmitter} = require('events');
const qs             = require('querystring');
const fetch          = require('node-fetch');
const Turndown       = require('turndown');
const turndown       = new Turndown();

// noinspection JSUnusedGlobalSymbols
class AoCHelper extends EventEmitter {
	/**
	 * @type {string}
	 */
	#sessionToken;
	
	#requestMap = {};
	#inputCache = {};
	
	/**
	 * @param {string} sessionToken Your session token included
	 * in all Advent of Code requests, if it starts with 'session='
	 * this will be trimmed off of the start.
	 */
	constructor(sessionToken) {
		super();
		if (sessionToken.startsWith('session=')) {
			sessionToken = sessionToken.substring(8);
		}
		
		this.#sessionToken = sessionToken;
	}
	
	// noinspection JSValidateTypes
	/**
	 * @param {string} HTML
	 * @returns {string}
	 */
	static htmlToMarkdown = (HTML) => turndown.turndown(HTML);
	
	/**
	 * @param {string} HTML
	 * @returns {string}
	 */
	static htmlToPlaintext = (HTML) => HTML.replace(/(<([^>]+)>)/ig, '');
	
	/**
	 * Returns the an hour head of EST where
	 * AoC's time is based upon so that we
	 * can start checking the "current day"
	 * for the question to be released
	 */
	#getCurrentAoCTime = () => {
		const local = new Date();
		return new Date((local.getTime() + (local.getTimezoneOffset() * 60000)) - (14400000));
	};
	
	/**
	 * Semi hacky way to turn a String like '5m 2s' to milliseconds.
	 *
	 * @param {string} str
	 * @returns {int}
	 */
	#parseTimeSegment = (str) => {
		const end = str.substring(str.length - 1);
		const num = str.substring(0, str.length - 1);
		
		if (end === 'h') {
			return parseInt(num) * 60 * 60 * 1000;
		} else if (end === 'm') {
			return parseInt(num) * 60 * 1000;
		} else if (end === 's') {
			return parseInt(num) * 1000;
		} else {
			return 0;
		}
	};
	
	/**
	 * @param {string} fetchURL
	 * @param {Object} fetchOptions
	 * @param {number} maxIterations
	 * @param {number} fallbackCooldown
	 * @param {number} iteration
	 * @returns {Promise<string>}
	 */
	#submit = (fetchURL, fetchOptions, maxIterations, fallbackCooldown, iteration) => new Promise((resolve, reject) =>
		fetch(fetchURL, fetchOptions).then(res => res.text()).then(txt => {
			if (txt.includes(`You don't seem to be solving the right level`)) {
				reject('This part has already been completed!');
			} else if (txt.includes(`That's not the right answer`)) {
				if (txt.includes('your answer is too low')) {
					reject('Input value is incorrect. Answer too low!');
				} else if (txt.includes('your answer is too high')) {
					reject('Input value is incorrect. Answer too high!');
				} else {
					reject('Input value is incorrect.');
				}
			} else if (txt.includes('You gave an answer too recently')) {
				if (iteration >= maxIterations) {
					reject(`Timeout after trying to POST ${maxIterations} times.`);
				} else {
					let time = fallbackCooldown;
					
					if (txt.includes(' You have ') && txt.includes(' left to wait.')) {
						const timeStr = txt.split(' You have ')[1].split(' left to wait.')[0];
						
						time = !timeStr.includes(' ') ? this.#parseTimeSegment(timeStr) :
							timeStr.split(' ').map(n => this.#parseTimeSegment(n)).reduce((a, b) => a + b);
					}
					
					this.emit('timeout', time, iteration);
					setTimeout(() => this.#submit(fetchURL, fetchOptions, maxIterations, fallbackCooldown, ++iteration)
						.then(resolve).catch(reject), time);
				}
			} else if (txt.includes(`That's the right answer`)) {
				resolve('Correct answer submitted!');
			} else {
				reject(`Couldn't detect timeout, success or incorrect. HTML:\n${txt}`);
			}
		}));
	
	/**
	 * Submits an answer for a specified day and part, if you've been
	 * submitting too quickly and get a cooldown it will detect how
	 * long it is and resubmit after the cooldown has finished.
	 * maxIterations and defaultCooldown are used as fallbacks where
	 * the cooldown cannot be parsed.
	 *
	 * @param {string|number} answer
	 * @param {number} [part=1]
	 * @param {number} [day]
	 * @param {number} [year]
	 * @param {number} [maxIterations=5]
	 * @param {number} [fallbackCooldown=10000]
	 * @returns {Promise<string>}
	 */
	submitAnswer = (answer, part, day, year, maxIterations, fallbackCooldown) => {
		if ('answer' in this.#requestMap)
			if (new Date().getTime() - this.#requestMap['answer'] < 5000)
				return new Promise((_, reject) => reject('You submitted an answer within' +
					'the last 5 seconds. Please wait a few seconds before resending your next attempt.'));
		this.#requestMap['answer'] = new Date().getTime();
		
		const now = this.#getCurrentAoCTime();
		
		if (part == null)
			part = 1;
		if (day == null)
			day = now.getDate();
		if (year == null)
			year = now.getFullYear() - (now.getMonth() === 11 ? 0 : 1);
		
		
		return new Promise((resolve, reject) => {
			const body = qs.stringify({level: part, answer: answer});
			this.#submit(`https://adventofcode.com/${year}/day/${day}/answer`,
				{
					method : 'POST',
					headers: {
						Cookie          : `session=${this.#sessionToken}`,
						'Content-Type'  : 'application/x-www-form-urlencoded',
						'Content-Length': `${body.length}`
					},
					body   : body
				}, maxIterations, fallbackCooldown, 1)
				.then(resolve)
				.catch(reject);
		});
	};
	
	/**
	 * @param {number} [day]
	 * @param {number} [year]
	 * @returns {Promise<string>}
	 */
	getInput = (day, year) => {
		if ('input' in this.#requestMap)
			if (new Date().getTime() - this.#requestMap['input'] < 5000)
				return new Promise((_, reject) => reject('You sent an input request within' +
					'the last 5 seconds. Please wait a few seconds before resending your next attempt.'));
		this.#requestMap['input'] = new Date().getTime();
		
		
		const now = this.#getCurrentAoCTime();
		if (day == null)
			day = now.getDate();
		if (year == null)
			year = now.getFullYear() - (now.getMonth() === 11 ? 0 : 1);
		
		if (!(year in this.#inputCache))
			this.#inputCache[year] = {};
		else if (day in this.#inputCache[year])
			return new Promise(resolve => resolve(this.#inputCache[year][day]));
		
		return new Promise((resolve, reject) =>
			fetch(`https://adventofcode.com/${year}/day/${day}/input`,
				{
					headers: {
						Cookie: `session=${this.#sessionToken}`
					}
				})
				.then(res => res.text())
				.then(resolve)
				.catch(reject));
	};
	
	/**
	 * @param {number} [part]
	 * @param {number} [day]
	 * @param {number} [year]
	 * @returns {Promise<string>}
	 */
	getQuestionHTML = (part, day, year) => {
		if ('question' in this.#requestMap)
			if (new Date().getTime() - this.#requestMap['question'] < 5000)
				return new Promise((_, reject) => reject('You sent a request for this within' +
					'the last 5 seconds. Please wait a few seconds before resending your next attempt.'));
		this.#requestMap['question'] = new Date().getTime();
		
		
		const now = this.#getCurrentAoCTime();
		if (part == null)
			part = 1;
		if (day == null)
			day = now.getDate();
		if (year == null)
			year = now.getFullYear() - (now.getMonth() === 11 ? 0 : 1);
		
		if (part === 0) {
			return new Promise((_, reject) => reject(`'part' cannot be set to 0`));
		}
		
		return new Promise((resolve, reject) =>
			fetch(`https://adventofcode.com/${year}/day/${day}`,
				{
					headers: {
						Cookie: `session=${this.#sessionToken}`
					}
				})
				.then(res => res.text())
				.then(res => {
					const matches = res.match(/<article class="day-desc">.*?<\/article>/gs);
					if (matches !== null) {
						if (matches.length >= part) {
							resolve(matches[part - 1]);
						} else {
							reject(`Part ${part} has not been unlocked yet!`);
						}
					} else {
						reject(`Couldn't find question <article> tag\n${res}`);
					}
				})
				.catch(reject));
	};
	
	/**
	 * Fetches the question HTML then uses Turndown to
	 * convert it to HTML which can be saved and viewed
	 * through an IDE or such.
	 *
	 * @param {number} [part]
	 * @param {number} [day]
	 * @param {number} [year]
	 * @returns {Promise<string>}
	 */
	getQuestionMarkdown = (part, day, year) =>
		new Promise((resolve, reject) =>
			this.getQuestionHTML(part, day, year)
				.then(AoCHelper.htmlToMarkdown)
				.then(resolve).catch(reject));
	
	/**
	 * Fetches the question HTML then strips all the HTML
	 * tabs so that which can be saved and viewed easier.
	 * If you use an IDE that supports viewing markdown,
	 * it's better to use {@link getQuestionMarkdown} as
	 * removing tags may occasionally break line breaks.
	 *
	 * @param {number} [part]
	 * @param {number} [day]
	 * @param {number} [year]
	 * @returns {Promise<string>}
	 */
	getQuestionPlaintext = (part, day, year) =>
		new Promise((resolve, reject) =>
			this.getQuestionHTML(part, day, year)
				.then(AoCHelper.htmlToPlaintext)
				.then(resolve).catch(reject));
	
	/**
	 * Invalidates the input caches, please
	 * never use this unless you absolutely need to.
	 *
	 * @returns {void}
	 */
	invalidateCache = () => {
		this.#inputCache = {};
	};
}


module.exports.AoCHelper = AoCHelper;
