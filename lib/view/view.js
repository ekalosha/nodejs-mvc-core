
// Using STRICT mode for ES6 features
"use strict";

/**
 * Requiring application Facade
 */
const applicationFacade = require('../facade.js').ApplicationFacade.instance;

/**
 * View types
 *
 * @type {{HTML: string, JSON: string, XML: string}}
 */
const ViewType = {
    HTML: 'HTML',
    JSON: 'JSON',
    XML: 'XML'
};

/**
 * Lodash swig integration
 *
 * @type {*|exports|module.exports}
 */
const swigLodash = require('swig-lodash');

/**
 *  Base view. Handle different view types. Apply SWIG templates
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class View {

    /**
     * Default view class
     *
     * @param {string} viewType
     * @param {{}} data
     * @param {string} template
     * @param {*} error
     */
    constructor (viewType, data, template, error) {
        /**
         * Requiring system logger
         *
         * @type {Logger|exports|module.exports}
         * @private
         */
        this._logger = require('../logger.js');

        this.data = data != null ? data : {};
        this.viewType = viewType;
        this.template = template;
        this.error = error;
    }

    /**
     * Get View type
     *
     * @returns {string}
     */
    get viewType () {
        return this._viewType;
    }

    /**
     * Set View type
     *
     * @param {string} value
     */
    set viewType (value) {
        switch (value) {
            case ViewType.HTML:
            case ViewType.JSON:
            case ViewType.XML:
                this._viewType = value;
                break;

            default :
                if (this._viewType == null) {
                    this._viewType = ViewType.HTML;
                }
        }
    }

    /**
     * Get template file path. For html/xml views only.
     *
     * @returns {string}
     */
    get template () {
        return this._template;
    }

    /**
     * Set template path. For html/xml views only.
     *
     * @param {string} value
     */
    set template (value) {
        this._template = value;
    }

    /**
     * Get view data.
     *
     * @returns {{}}
     */
    get data () {
        return this._data;
    }

    /**
     * Set view data.
     *
     * @param {{}} value
     */
    set data (value) {
        this._data = value;
    }

    /**
     * Get current view error
     *
     * @returns {*|View.error}
     */
    get error () {
        return this._error;
    }

    /**
     * Get current view error
     *
     * @param {*} value
     */
    set error (value) {
        this._error = value;
    }

    /**
     * Get current SWIG Engine
     *
     * @returns {{}}
     */
    get swigEngine () {
        return this._swigEngine;
    }

    /**
     * Set current SWIG Engine
     *
     * @param {{}} value
     */
    set swigEngine (value) {
        this._swigEngine = value;
    }

    /**
     * Creates HTML View for specified parameters
     *
     * @param template
     * @param data
     * @param error
     * @returns {View}
     */
    static htmlView (template, data, error) {
        var viewInstance = new View(ViewType.HTML, data, template, error);

        return viewInstance;
    }

    /**
     * Creates JSON View for specified data
     *
     * @param data
     * @param error
     * @returns {View}
     */
    static jsonView (data, error) {
        var viewInstance = new View(ViewType.JSON, data, null, error);

        return viewInstance;
    }

    /**
     * Set filter for SWIG view
     *
     * @param filterName
     * @param filterFunction
     */
    static setFilter (filterName, filterFunction) {
        if (typeof filterFunction == "function") {
            View.filtersMap[filterName] = filterFunction;
        } else {
            console.warn('WARN. Cannot register filter {%s} for template engine.', filterName);
        }
    }

    /**
     * Remove filter for SWIG view
     *
     * @param filterName
     * @param filterFunction
     */
    static removeFilter (filterName) {
        if (View.filtersMap[filterName] != null) {
            delete View.filtersMap[filterName];
        }
    }

    /**
     * Apply filters to SWIG view
     *
     * @param swigEngine
     */
    static applyFilters (swigEngine) {
        if (View.filtersMap != null) {
            for (var filterName in View.filtersMap) {
                if (View.filtersMap.hasOwnProperty(filterName)) {
                    swigEngine.setFilter(filterName, View.filtersMap[filterName]);
                }
            }
        }
    }

    /**
     * Getter for Content Type Header
     */
    get contentType () {
        var result = 'application/octet-stream';

        switch (this.viewType) {
            case ViewType.HTML:
                result = "text/html";
                break;
            case ViewType.JSON:
                result = "text/x-json; charset=utf-8";
                break;
            case ViewType.XML:
                result = "application/xml";
                break;
        }

        return result;
    }

    /**
     * Render view output. If response specified - writes proper headers.
     *
     * @param response
     * @returns {*}
     */
    render (response, request) {
        var result = null;

        if (this.error == null) {
            var outputContent = '';
            if (this.viewType == ViewType.HTML) {
                this._logger.debug('@@ Loading HTML View: %', this.template);

                /**
                 * Initializing SWIG Engine if not set
                 */
                if (this.swigEngine == null) {
                    // Initializing SWIG Defaults
                    var swigDefaults = {};
                    if (applicationFacade.config.isDev) {
                        swigDefaults.cache = false;
                    }

                    // Requiring swig class
                    var swig  = require('swig');
                    swig.setDefaults(swigDefaults);

                    // Add all lodash functions
                    swigLodash.useFilter(swig);

                    // Creating separate SWIG Engine for Template parser
                    this.swigEngine = swig;
                }

                // Adding filters to the SWIG Engine
                View.applyFilters(this.swigEngine);

                // add the global config to this.data if it isn't already present
                if (!this.data.globalConfig) {
                    this.data.globalConfig = {};
                    if (applicationFacade.config.__env) {
                        this.data.globalConfig = applicationFacade.config.__env;
                    }
                }

                var swigTemplate = this.swigEngine.compileFile(this.template);
                outputContent = swigTemplate(this.data);

            } else if (this.viewType == ViewType.JSON) {
                outputContent = JSON.stringify(this.data);
            }

            result = outputContent;

            // Set response
            if (response != null) {
                response.set({"Content-Type": this.contentType});
                response.status(200).send(result);
            }
        } else {
            // Set response
            if (response != null) {
                var httpStatus = this.error.httpStatus != null && this.error.httpStatus > 0 ? this.error.httpStatus : 500;
                if (this.viewType == ViewType.JSON) {
                    var resultObject = {
                        error: {
                            code: this.error.id ? this.error.id : httpStatus,
                            message: this.error.message
                        }
                    };
                    result = JSON.stringify(resultObject);
                } else {
                    result = this.error.message;
                }

                response.set({"Content-Type": this.contentType});
                response.status(httpStatus).send(result);
            }
        }

        return result;
    }

};

/**
 * Map of SWIG UI filters
 * S
 * @type {{}}
 */
View.filtersMap = {};

/**
 * Exporting view classes
 */
module.exports.ViewType = ViewType;
module.exports.View = View;
