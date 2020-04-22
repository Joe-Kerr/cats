!function(r,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.catsjs=e():r.catsjs=e()}(window,(function(){return function(r){var e={};function t(o){if(e[o])return e[o].exports;var n=e[o]={i:o,l:!1,exports:{}};return r[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}return t.m=r,t.c=e,t.d=function(r,e,o){t.o(r,e)||Object.defineProperty(r,e,{enumerable:!0,get:o})},t.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},t.t=function(r,e){if(1&e&&(r=t(r)),8&e)return r;if(4&e&&"object"==typeof r&&r&&r.__esModule)return r;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:r}),2&e&&"string"!=typeof r)for(var n in r)t.d(o,n,function(e){return r[e]}.bind(null,n));return o},t.n=function(r){var e=r&&r.__esModule?function(){return r.default}:function(){return r};return t.d(e,"a",e),e},t.o=function(r,e){return Object.prototype.hasOwnProperty.call(r,e)},t.p="",t(t.s=0)}([function(r,e,t){"use strict";t.r(e),t.d(e,"parseConfig",(function(){return u}));const o=["string","number","object","boolean","function"],n={};var i=class{constructor(r){this.shorthandParser=r.shorthandParser}checkType(r,e,t,n){if(!r||!(null!==t))return;const i=typeof e;if(-1===o.indexOf(i))throw new TypeError("ConfigParser error: config property value has an unknown type: "+i);if(i!==t)throw new TypeError("ConfigParser error: property '"+n+"' must be of type '"+t+"' but is of type '"+i+"'.")}checkRequiredValue(r,e,t){if(!e&&r.required)throw new Error("ConfigParser error: config property '"+t+"' is required but not provided.")}getSchemaType(r){const e=r.type;if(null===e)return e;if(void 0===e)throw new Error("ConfigParser error: type property on schema is missing");if(-1===o.indexOf(e))throw new TypeError("ConfigParser error: schema property value has an unknown type: "+e);return e}handleRecursiveProperty(r,e,t,o){return!("object"!=typeof t||t instanceof Array||"type"in e)&&(o[r]={},this.walkConfig(t,e,o[r]),!0)}handleMissingSchema(r,e){const t=[];for(const o in r)o in e||t.push(o);if(t.length>0)throw new Error("ConfigParser error: The following config property was / properties were provided for which no schema exists: "+t.toString())}walkConfig(r,e,t){for(const o in e){const n=e[o],i="string"!=typeof n?n:this.shorthandParser.parse(n),s=r[o];if(this.handleRecursiveProperty(o,i,s,t))return;const a=this.getSchemaType(i),u=o in r;this.checkRequiredValue(i,u,o),this.checkType(u,s,a,o),this.checkType(void 0!==i.default,i.default,a,"default value"),t[o]=u?s:i.default}this.handleMissingSchema(r,e)}parse(r,e,t={}){this.walkConfig(t,n);const o={};return this.walkConfig(r,e,o),o}};const s=["string","number","object","boolean"];var a=class{constructor(){}typeCheckNumber(r){return"number"==typeof r&&!1===isNaN(r)}parseNumberFromString(r){const e=1*r;if(r!==""+e)throw new TypeError("#todo | ConfigParserShorthand.parseNumberFromString input != output");if(!this.typeCheckNumber(e))throw new Error("#todo | ConfigParserShorthand.parseNumberFromString output not a number; isNaN?: "+isNaN(e));return e}parseBooleanFromString(r){return"true"===r||"false"!==r&&void 0}parseObjectFromString(r){if("[]"===r)return[];if("{}"===r)return{};throw new Error("Error in ConfigParserShorthand: failed to parse shorthand object. Only '[]' or '{}' are allowed as shorthand object properties.")}parseDefaultValue(r,e){let t=e;if(void 0!==e)return"string"===r||("number"===r?t=this.parseNumberFromString(t):"boolean"===r?t=this.parseBooleanFromString(t):"object"===r&&(t=this.parseObjectFromString(t))),t}parse(r){const e={type:null,default:void 0,required:!1},t=r.length;let o=r;if("*"===r[t-1]&&(e.required=!0,o=r.substring(0,t-1)),o=o.split(":"),e.type=o[0],-1===s.indexOf(e.type))throw new Error("shorthand: illegal type");return e.default=this.parseDefaultValue(e.type,o[1]),e}};function u(r={},e={}){const t=new a;return new i({shorthandParser:t}).parse(r,e)}}])}));