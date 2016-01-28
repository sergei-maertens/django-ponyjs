'use strict';

import Handlebars from 'handlebars';

// register the default tags/filters as handlebars helpers
import './defaulttags.js';
// import './templates/handlebars/defaultfilters.js';


import { translate as _translate } from 'hbs';


export function translate(load) {
    // tokenize the template to extract {{load ...}} helpers and actually
    // import these custom helper libraries
    let helperModules = [];
    let parsed = Handlebars.parse(load.source);
    for (let i=0; i<parsed.body.length; i++) {
        let node = parsed.body[i];
        // only look at {{...}} tokens
        if (node.type !== 'MustacheStatement') {
            continue;
        }
        // no pathing is supported
        if (node.path.original != 'load') {
            continue;
        }

        // now look at (and validate) the arguments - it must be Strings
        for (let j=0; j<node.params.length; j++) {
            let param = node.params[j];
            if (param.type !== 'StringLiteral') {
                throw TypeError(`Invalid {{load}} helper in ${load.address}: arguments must be string literals`);
            }
            helperModules.push(`hbshelpers/${param.value}`);
        }
    }

    // call the original translate to get the 'module.exports = require... bits';
    _translate(load);

    let requires = helperModules.map(module => `require('${module}');`);
    requires.push(load.source);
    load.source = requires.join('\n');
};
