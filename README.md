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
/config/env

Using the example from above, our application will look for this config file:
/config/env/environment-name

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


