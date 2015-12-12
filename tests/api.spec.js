/* global beforeEach, describe, expect, it */
'use strict';

import { Model } from 'ponyjs/models/base';
import QuerySet from 'ponyjs/models/query';
import { IntegerField } from 'ponyjs/models/fields/fields';


let Pizza = Model('Pizza', {
    id: new IntegerField()
});


describe('Model Manager queries', () => {

    it('should return promises');

});
