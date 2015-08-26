'use strict';

export function hello(bye) {
	let name = 'Foo';
	let greeting = `Hello ${name}`;

	if (bye) {
		// Should not be covered
		return 'Good bye';
	}

	return greeting;
}
