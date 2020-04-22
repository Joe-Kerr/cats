const assert = require("assert");
const {parseConfig} = require("../../src/index.js");
const ConfigParserShorthand = require("../../src/ConfigParserShorthand.js").default;

suite("ConfigParser - shorthand notation parameterised tests");

function compareResults(desc, config, regular, shorthand) {
	test(desc, ()=>{
		assert.deepEqual(
			parseConfig(config, regular),
			parseConfig(config, shorthand),
			desc
		);
	});
}

[
{type: "string", value: "test"},
{type: "number", value: 123},
{type: "number", value: 12.3},
{type: "boolean", value: false},
{type: "boolean", value: true},
{type: "object", value: []},
].forEach((testObj)=>{
	const type = testObj.type;
	const configValue = testObj.value;
	const schemaValue = (type === "object") ? JSON.stringify(configValue) : configValue;
	
	compareResults(
		`type ${type}, w/o default, not required`,
		{test: configValue},
		{test: {type: type}},
		{test: type}
	);		
	
	compareResults(
		`type ${type}, w default, not required`,
		{},
		{test: {type: type, default: configValue}},
		{test: type+`:`+schemaValue}
	);		
	
	compareResults(
		`type ${type}, w default, required`,
		{test: configValue},
		{test: {type: type, default: configValue, required: true}},
		{test: type+`:`+schemaValue+`*`}
	);		
	
	compareResults(
		`type ${type}, w/o default, required`,
		{test: configValue},
		{test: {type: type, required: true}},
		{test: type+"*"}
	);
});
	
suite("ConfigParser - shorthand notation manual tests");

test("ConfigParserShorthand.parseNumberFromString handles ints and floats", ()=>{
	const parser = new ConfigParserShorthand();
	
	[
		["3.14", 3.14],
		["8208", 8208]
	].forEach((testParams)=>{
		const actual = testParams[0];
		const expected = testParams[1];
		
		assert.equal( parser.parseNumberFromString(actual), expected);
	});
});

test("ConfigParserShorthand.parseNumberFromString throws if parsing as int/float fails", ()=>{
	const parser = new ConfigParserShorthand();
	
	["3.5.7", "1,3.610", "13 ", 123, {}].forEach((testParam)=>{
		assert.throws(()=>{
			parser.parseNumberFromString(testParam);
		}, {message: /parseNumberFromString/});
	});
});

test("ConfigParserShorthand throws if default value is a non-empty object or array", ()=>{
	assert.throws(()=>{ parseConfig({}, {test: "object:[1]"}); }, {message: /failed to parse shorthand object/});
	assert.throws(()=>{ parseConfig({}, {test: "object:{a:1}"}); }, {message: /failed to parse shorthand object/});
});