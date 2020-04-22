const assert = require("assert");
const {parseConfig} = require("../../src/index.js");
const ConfigParser = require("../../src/ConfigParser.js").default;


suite("ConfigParser");

test("ConfigParser constructor assigns shorthandParser service", ()=>{
	const service = {};
	const parser = new ConfigParser({shorthandParser: service});
	
	assert.equal(parser.shorthandParser, service);
});

test("ConfigParser returns expected config object", ()=>{
	const schema = {
		a: {type: "string"},
		b: {type: "number"},
		c: {type: "boolean"},
		d: {type: "function"},
		e: {type: "object"},
		f: {type: "object"},
	};
	const config = {
		a: "abc",
		b: 123,
		c: false,
		d: ()=>{},
		e: {},
		f: []
	};
	
	assert.deepEqual(parseConfig(config, schema), config);
});

test("ConfigParser fills defaults if not provided", ()=>{
	const schema = {a: {type: "number", default: 1}, b: {type: "number", default: 2}};
	const config = {a: 11};
	
	assert.deepEqual(parseConfig(config, schema), {a: 11, b: 2});
});

test("ConfigParser does not type check if default type null", ()=>{
	assert.doesNotThrow(()=>{
		parseConfig({a: "notNull"}, {a: {type: null}});
	});
});

test("ConfigParser processes recursive object properties", ()=>{
	const config = {nonRecursive: 123, recursive: {
		nonRecursive: "abc", recursive: {
			nonRecursive: "456"}
		}
	};
	const schema = {nonRecursive: {type: "number"}, recursive: {
		nonRecursive: "string", //shorthand
		recursive: {
			nonRecursive: {type: "string"}
		}
	}};
	
	const result = parseConfig(config, schema);
	assert.deepEqual(result, config);	
});


test("Untestable?: ConfigParser throws if a config prop has an unkown type");

test("ConfigParser throws if non-null type mismatches schema type", ()=>{
	["123", [123], ()=>123, {"123":123}, false].forEach((illegalVal)=>{
		assert.throws(()=>{ parseConfig({test: illegalVal}, {test: {type: "number"}}); }, {message: /must be of type/});
	});
});

test("ConfigParser throws if a required prop is not provided", () => {
	assert.throws(()=>{ parseConfig({notTest: "whatever"}, {test: {required: true, type: "string"}}) }, {message: /is required but not provided/});
});

test("ConfigParser throws if type property missing on schema", ()=>{
	assert.throws(()=>{ parseConfig({a:1}, {a: {anythingBut: "type"}}); }, {message: /type property on schema/});
});

test("ConfigParser throws if a schema prop has an unkown type", ()=>{
	assert.throws(()=>{ parseConfig({a:1}, {a: {type: "bollocks"}}); }, {message: /schema property value has an unknown type/});
});

test("ConfigParser throws if config props have no schema", ()=>{
	assert.throws(()=>{ parseConfig({a:1}, {}) }, {message: /for which no schema exists/});
});

test("ConfigParser throws if default value does not match schema type", ()=>{
	assert.throws(()=>{ parseConfig({}, {test: {type: "number", default: "123"}}); }, {message: /must be of type/});
});


suite("ConfigParser - bug fixes");

test("ConfigParser default values of recursive schema are applied when no config is provided", ()=>{
	const schema = {
		recursive: {
			a: {type: "number", default: 123},
			recursive: {
				b: {type: "string", default: "abc"}
			}
		},
		
		recursive2: {
			c: {type: "boolean", default: false}
		}
	};
	
	assert.deepEqual(parseConfig({}, schema), {
		recursive: {
			a: 123, 
			recursive: {b: "abc"}
		},
		recursive2: {
			c: false
		}
	});
});