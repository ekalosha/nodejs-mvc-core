
// Using STRICT mode for ES6 features
"use strict";

var Core = require('../../index.js');

/**
 *  Importing Application Facade and run the Application.
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
var applicationFacade = Core.ApplicationFacade.instance;

applicationFacade.load('cli', require('./cli-module.js'));

// Initializing all modules
applicationFacade.init();

// Running modules
applicationFacade.run();
