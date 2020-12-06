/******************************************************************************
 *                                                                            *
 * aoc-helper - index.d.ts                                                    *
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

import {EventEmitter} from 'events';

//noinspection JSUnusedGlobalSymbols
export class AoCHelper extends EventEmitter {
    /**
     * @param {string} sessionToken Your session token included
     * in all Advent of Code requests, if it starts with 'session='
     * this will be trimmed off of the start.
     */
    constructor(sessionToken: string);
    
    static htmlToMarkdown:(HTML: string) => string;
    
    static htmlToPlaintext:(HTML: string) => string;
    
    /**
     * Submits an answer for a specified day and part, if you've been
     * submitting too quickly and get a cooldown it will detect how
     * long it is and resubmit after the cooldown has finished.
     * maxIterations and defaultCooldown are used as fallbacks where
     * the cooldown cannot be parsed.
     */
    submitAnswer: (answer: string|number, part: number, day: number, year: number, maxIterations?: number, fallbackCooldown?: number) => Promise<string>;
    
    getInput: (day?: number, year?: number) => Promise<string>;
    
    getQuestionHTML: (part?: number, day?: number, year?: number) => Promise<string>;
    
    /**
     * Fetches the question HTML then uses Turndown to
     * convert it to HTML which can be saved and viewed
     * through an IDE or such.
     */
    getQuestionMarkdown: (part?: number, day?: number, year?: number) => Promise<string>;
    
    /**
     * Fetches the question HTML then strips all the HTML
     * tabs so that which can be saved and viewed easier.
     * If you use an IDE that supports viewing markdown,
     * it's better to use {@link getQuestionMarkdown} as
     * removing tags may occasionally break line breaks.
     */
    getQuestionPlaintext: (part?: number, day?: number, year?: number) => Promise<string>;
    
    /**
     * Invalidates the leaderboard and input caches, please
     * never use this unless you absolutely need to.
     */
    invalidateCache: () => void;
}
