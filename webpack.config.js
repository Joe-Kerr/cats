const packageJson = require("./package.json");

function getProjectInfo(env, path) {
	const projectName = env;
	const projectRoot = path.join(__dirname, (packageJson.name === "devenvbrowser") ? "./projects/" + projectName + "/" : "./" + projectName + "/");
	const projectIndex = path.join(projectRoot, "src/index.js");

	return 	{projectName, projectRoot, projectIndex}
}

function checkProjectDirs(fs, projectIndex, projectRoot) {
	if(!fs.existsSync(projectIndex)) {
		console.error("Project not found: "+projectIndex);
		process.exit(1);
	}

	if(!fs.existsSync(projectRoot+"package.json")) {
		console.error("Package.json not found in project: "+projectRoot);
		process.exit(1);
	}	
}

function getBuilds(projectInfo, builds, path) {	
	return builds.map((build)=>({
			entry: projectInfo.projectIndex,
			target: build.target,
			output: {
				path: path.join(projectInfo.projectRoot, "dist"),
				filename: projectInfo.projectName + "." + build.nameSuffix + ".js",
				library: projectInfo.projectName,
				libraryTarget: build.libraryTarget,
				libraryExport: build.libraryExport
			},
			mode: "production",		
	}));	
}

module.exports = function(env, argv) {
	const path = require("path");
	const fs = require("fs");
	
	const projectInfo = getProjectInfo(env, path);
	const {projectName, projectRoot, projectIndex} = projectInfo;

	checkProjectDirs(fs, projectIndex, projectRoot);
	
	let getOverride = null;
	try {
		getOverride = require(path.join(projectRoot, "webpack.config.override.js"));
	}
	catch(e) {
		//noop
	}
	
	//Note: "libraryExport" acts as a property accessor on the object the module exports. When set to "default", libraryExport will fix the export default compatiblity issue. 
	//      But: module = {default, someNameExport} -> module[libraryExport]. Obvious issue: "someNamedExport" gets dropped. Also if no "export default", returns undefined.
	const buildTemplates = [
		{target: "webworker", libraryTarget: "umd", nameSuffix: "worker"},
		{target: "node", libraryTarget: "commonjs2", nameSuffix: "node", libraryExport: undefined},
		{target: "web", libraryTarget: "umd", nameSuffix: "web.umd", libraryExport: undefined},
		{target: "web", libraryTarget: "var", nameSuffix: "web.window", libraryExport: undefined},
		{target: "web", libraryTarget: "commonjs2", nameSuffix: "web.common", libraryExport: undefined},
	];	
	
	const builds = getBuilds(projectInfo, buildTemplates, path);
	
	if(getOverride !== null) {
		return getOverride(env, argv, projectRoot, builds);
	}
	
	return builds;
}