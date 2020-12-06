/******************************************************************************
 *                                                                            *
 * aoc-helper - example/index.js                                              *
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

/*
 * ============= WARNING =============
 * If you run this file it will submit
 * a wrong answer to 2020 Day 5 Part 2
 *  If you have no completed this yet
 * please change line 29 to a day that
 * is already completed if you want to
 * run this as an example to test it,
 * or change the value to a valid answer
 *
 * ============ DISCLAIMER ===========
 *   I take no responsibility if you
 *  submit wrong answers or get timed
 *  out.  I use this personally and it
 *  works for me so I decided to clean
 *         it up and share it.
 */

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
