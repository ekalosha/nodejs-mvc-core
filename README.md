# nodejs-mvc-core
NodeJS MVC abstractions (Facade, Model, View, Controller, common libraries).

## Configuration

By default configuration is stored in the .env file (like it is in dotenv). To get started, create a .env file in your root folder. You can use .env-base file as a template.
The .env file is specific to your environment and should not be part of the git repository (it is included to .gitignore).
Its contents should be at the minimum a line like the following:

```ini
NODE_ENV=environment-name
```

Our server.js file will then load a config file based on that NODE_ENV value.

Save your config file in this location:
/config

Using the example from above, our application will look for this config file:
/config/environment-name

## Application Types

Based on your need you may create different type of applications and/or server processed. Most widely used types are:

    HTTP Server
    CRON Jobs Application
    Commandline Application
    Queue Jobs Server

You application may be a combination of few types of processes.


## Run Application

As nodejs itself now supports ES6 in production mode, you need to use latest nodejs build to run the application.

Please download latest build of nodejs from https://nodejs.org/dist/

To run the application please do the following:

Install dependencies:

```
npm install
```

Create servers.js/application.js or any other application file and run it.

```
node server.js
```

Example of simple application:

```
// Using STRICT mode for ES6 features
"use strict";

var Core = require('dft-mvc-core');

/**
 *  Importing Application Facade and run the Application.
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
var applicationFacade = Core.ApplicationFacade.instance;
applicationFacade.load('server', Core.Modules.HTTPServer);
applicationFacade.load('mongoose', Core.Modules.Mongoose);
applicationFacade.load('bootstrap', require('./app/bootstrap.js'));

// Initializing all modules
applicationFacade.init();

// Running modules
applicationFacade.run();

```

Example of Bootstrap Class:

```

// Using STRICT mode for ES6 features
"use strict";

var Core = require('dft-mvc-core');

/**
 * Importing Application Facade
 *
 * @type {ApplicationFacade|*}
 */
var applicationFacade = Core.ApplicationFacade.instance;

/**
 * Require Async operations helper
 *
 * @type {exports|module.exports}
 */
var async = require("async");

/**
 *  Web Init Module
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class WebInitModule extends Core.Bootstrap {

    /**
     * HTTP Server constructor
     */
    constructor () {
        // We must call super() in child class to have access to 'this' in a constructor
        super();
    }

    /**
     * Initialize server application
     */
    init () {
        // Inherit bindings to parents initialization
        super.init();

        this._logger.log('@@@@ Init server application');
        this.applicationFacade.model.loadModels(this.applicationFacade.basePath + "/app/models");

        // Loading module routes
        this.applicationFacade.server.loadRoutes('/app/routes');
    };

    /**
     * Running module
     */
    run () {
        this._logger.log('@@@@ Run Bootstrap module');
    };

    /**
     * Bootstrapping module
     */
    bootstrap () {
        super.bootstrap();

        this._logger.log('[WebInitModule] Bootstraping Module: ', this.name);
    };
}

module.exports = WebInitModule;
```


