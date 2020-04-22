import _parseConfig from "../parseConfig.js";

export {
/// Check a (user) provided config object against a (developer) pre-defined schema object.
/// @function parseConfig
/// @param {object} config - The actual config object you provide. Property-value pairs describe the config options. Can be recursive.
/// @param {object} schema - The schema object the config object must adhere to. 
/// @param {(object|string)} schema.key - Each key describes a config property. Can be object notation or shorthand string notation. See example below.
/// @returns {object} Returns the config object checked against the schema object and optionally with default values set.
/// @throws Throws for various errors such as type mismatches or missing required config properties. It is assumed that the function will be called on application start so that a fail fast behaviour is feasible. Plus, unexpected or undefined config variables are likely always exceptions.
/// @example <caption>Simple usage</caption>
/// parseConfig({
///   aString: "abc",
///   aNumber: 123,
/// }, {
///   aString: {type: "string", required: true},
///   aNumber: "number*"
///   someDefault: {type: "number", default: 456}
/// });
/// @example <caption>Shorthand notation</caption>
/// {schemaProp: "type:defaultVal*"} //an asterisk at the end denotes a required property
/// @example <caption>Recursive config</caption>
/// parseConfig({
///   version: "1.2.3",
///   project: {
///     name: "cats",
///     author: "Joe Kerr"
///   }
/// }, {
///   version: "string:0.0.1",
///   project: {
///     name: "string",
///     author: "string:Joe Kerr",
///   }
/// });
/// @example <caption>Do not process property</caption>
/// {schemaProp: {type: null}}	
	_parseConfig as parseConfig
};