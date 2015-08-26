/* global beforeEach, describe, expect, it */
'use strict';

import {hello} from './hello';
describe('hello', () => {

	it('should return Hello Foo', function () {
		expect(hello()).to.equal('Hello Foo');
	});

    it('should return Good bye', () => {
        expect(hello(true)).to.equal('Good bye');
    });
});
