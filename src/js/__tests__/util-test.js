
jest.dontMock('../utils/util');

var util = require('../utils/util');

describe('util.type_check', function() {
 it('converts a number type of "2.5" to the float 2.5', function() {
   expect(util.type_check("2.5", "number")).toBe(2.5);
 });
});

describe('util.toggleInList', function() {
 it('removes "dog" from a short array', function() {
   var res = util.toggleInList(["dog","cat"], "dog");
   expect(res[0]).toBe("cat");
   expect(res.length).toBe(1);
 });
});