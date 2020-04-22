/*
Eg:
const defs = {
	prop: {
		type: "string", default: "abc", required: true
		//short: string:abc*
	}
};
*/


const TYPES = [
	"string",
	"number",
	"object",
	"boolean",
	"function"
];

const OPTIONS_SCHEMA = {
	
};

class ConfigParser {
	constructor(services) {
		this.shorthandParser = services.shorthandParser;
	}
	
	checkType(isOnConfig, value, expectedType, propName) {
		const isTypeCheckRequired = (expectedType !== null);
		
		if(!isOnConfig || !isTypeCheckRequired) {
			return;
		}
		
		const actualType = typeof value;
		
		
		if(TYPES.indexOf(actualType) === -1) {
			throw new TypeError("ConfigParser error: config property value has an unknown type: "+actualType);
		}
		
		if(actualType !== expectedType) {
			throw new TypeError("ConfigParser error: property '"+propName+"' must be of type '"+expectedType+"' but is of type '"+actualType+"'.");
		}
	}
	
	checkRequiredValue(schemaProp, isOnConfig, propName) {
		if(!isOnConfig && schemaProp.required) {
			throw new Error("ConfigParser error: config property '"+propName+"' is required but not provided.");
		}
	}
	
	getSchemaType(schemaProp) {
		const type = schemaProp.type;
		
		if(type === null) {
			return type;
		}
		
		if(typeof type === "undefined") {
			throw new Error("ConfigParser error: type property on schema is missing");
		}
		
		if(TYPES.indexOf(type) === -1) {
			throw new TypeError("ConfigParser error: schema property value has an unknown type: "+type);
		}	

		return type;
	}
	
	handleRecursiveProperty(name, schemaProp, configProp, result) {
		const isConfigAnObjectOrNotProvided = (typeof configProp === "object" || typeof configProp === "undefined");
		
		if(isConfigAnObjectOrNotProvided && !(configProp instanceof Array) && !("type" in schemaProp)) {
			result[name] = {};
			this.walkConfig(configProp || {}, schemaProp, result[name]);
			return true;
		}
		
		return false;
	}
	
	handleMissingSchema(config, schema) {
		const mismatch = [];
		
		for(const name in config) {
			if(!(name in schema)) {
				mismatch.push(name);
			}
		}
		
		if(mismatch.length > 0) {
			throw new Error("ConfigParser error: The following config property was / properties were provided for which no schema exists: "+mismatch.toString());
		}		
	}
	
	walkConfig(config, schema, result) {
		for(const name in schema) {			
			const prelimProp = schema[name];			
			const schemaProp = (typeof prelimProp !== "string") ? prelimProp : this.shorthandParser.parse(prelimProp);									
			const actualValue = config[name];						
			
			if(this.handleRecursiveProperty(name, schemaProp, actualValue, result)) {
				continue;
			}
			
			const schemaType = this.getSchemaType(schemaProp);
			const isProvided = name in config;
			
			this.checkRequiredValue(schemaProp, isProvided, name);
			this.checkType(isProvided, actualValue, schemaType, name);
			this.checkType(typeof schemaProp.default !== "undefined", schemaProp.default, schemaType, "default value");
			
			result[name] = (isProvided) ? actualValue : schemaProp.default;
		}
		
		//Here instead of before for-loop in order to detect a missing property that is required. 
		//NB: Differentiate missing config not in schema / missing schema not in config.
		this.handleMissingSchema(config, schema);
	}
	
	parse(config, schema, _options={}) {
		const options = this.walkConfig(_options, OPTIONS_SCHEMA);
		
		const result = {};
		this.walkConfig(config, schema, result);
		return result;
	}
}

export default ConfigParser;