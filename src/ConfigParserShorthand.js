const LEGAL_SHORTHAND_TYPES = [
	"string",
	"number",
	"object",
	"boolean"
];

class ConfigParserShorthand {
	constructor() {}
	
	typeCheckNumber(wouldBeNumber) {
		return (typeof wouldBeNumber === "number" && isNaN(wouldBeNumber) === false);
	}
	
	parseNumberFromString(number) {
		const parsed = number * 1;
		
		if(number !== (""+parsed)) {
			throw new TypeError("#todo | ConfigParserShorthand.parseNumberFromString input != output");
		}
		
		if(!this.typeCheckNumber(parsed)) {
			throw new Error("#todo | ConfigParserShorthand.parseNumberFromString output not a number; isNaN?: "+isNaN(parsed));
		}
		
		return parsed;
	}
	
	parseBooleanFromString(value) {
		return (value === "true") ? true : (value === "false") ? false : undefined;
	}
	
	parseObjectFromString(value) {
		if(value === "[]") {
			return [];
		}
		
		if(value === "{}") {
			return {};
		}
		
		throw new Error("Error in ConfigParserShorthand: failed to parse shorthand object. Only '[]' or '{}' are allowed as shorthand object properties.");
	}
	
	parseDefaultValue(type, rawValue) {
		let value = rawValue;
		
		if(typeof rawValue === "undefined") {
			return undefined;
		}
		
		else if(type === "string") {
			//noop
		}
		
		else if(type === "number") {
			value = this.parseNumberFromString(value);
		}
		
		else if(type === "boolean") {
			value = this.parseBooleanFromString(value);
		}
		
		else if(type === "object") {		
			value = this.parseObjectFromString(value);
		}			
		
		return value;		
	}
	
	separateTypeAndDefault(string) {
		const firstColonIndex = string.indexOf(":");
		
		if(firstColonIndex === -1) {
			return [string, undefined];
		}
		
		return [
			string.substring(0, firstColonIndex),
			string.substring(firstColonIndex+1, string.length)
		];
	}
	
	parse(propString) {
		const prop = {type: null, default: undefined, required: false};
		const length = propString.length;
		let wip = propString;
		
		if(propString[length-1] === "*") {
			prop.required = true;
			wip = propString.substring(0, length-1);
		}
		
		wip = this.separateTypeAndDefault(wip);

		prop.type = wip[0];
		
		if(LEGAL_SHORTHAND_TYPES.indexOf(prop.type) === -1) {
			throw new Error("shorthand: illegal type");
		}
		
		prop.default = this.parseDefaultValue(prop.type, wip[1]);

		return prop;
	}
}

export default ConfigParserShorthand;