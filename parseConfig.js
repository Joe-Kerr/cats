import ConfigParser from "./src/ConfigParser.js";
import ConfigParserShorthand from "./src/ConfigParserShorthand.js";

export default function parseConfig(config={}, schema={}) {
	const shorthandParser = new ConfigParserShorthand();
	return new ConfigParser({shorthandParser}).parse(config, schema);
}