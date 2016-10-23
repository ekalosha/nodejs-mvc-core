'use strict';

/**
 * State Controller
 *
 * @type {*|exports|module.exports}
 */
var StateController = require('./statecontroller.js');

/**
 * Base view
 *
 * @type {*|View}
 */
var View = require('../view/view.js').View;

/**
 * Require Async helper actions
 *
 * @type {exports|module.exports}
 */
var async = require("async");

/**
 *  API Controller controller
 *
 *  Default routes:
 *
 *      'get|/{instances}': 'path-to-api-class.js', // List route
 *      'get,post|/{instances}/:action': 'path-to-api-class.js', // GET single item (get) and INSERT item (post)
 *      'get,post|/{instances}/:id/:action': 'path-to-api-class.js', // UPDATE/DELETE item
 *
 *
 *  @author Eugene A. Kalosha <ekalosha@dfusiontech.com>
 */
class APIController extends StateController {

    /**
     * Controller constructor
     */
    constructor(request, response) {
        // We must call super() in child class to have access to 'this' in a constructor
        super(request, response);

        /**
         * The default page size
         *
         * @type {number}
         * @private
         */
        this._defaultPageSize = 20;

        /**
         * The maximum page size
         *
         * @type {number}
         * @private
         */
        this._maxPageSize = 500;

        /**
         * Current API model instance
         *
         * @type {AbstractModel}
         * @private
         */
        this._model = null;

        /**
         * Mongoose Population fields
         * url: {@link http://mongoosejs.com/docs/populate.html|Mongoose Doc}
         *
         * @type {string}
         * @private
         */
        this._modelPopulateFields = '';

        /**
         * Current data items
         *
         * @type {{}}
         */
        this.data = {};
    }

    /**
     * Current model for API calls
     *
     * @returns {AbstractModel}
     */
    get model() {
        return this._model;
    }

    /**
     * Current model populate fields
     *
     * @returns {string}
     */
    get modelPopulateFields() {
        return this._modelPopulateFields;
    }

    /**
     * Current default page size
     *
     * @returns Number
     */
    get defaultPageSize() {
        return this._defaultPageSize;
    }

    /**
     * Current maximum page size
     *
     * @returns Number
     */
    get maxPageSize() {
        return this._maxPageSize;
    }

    /**
     * Start application
     *
     * @override
     */
    start (callback) {
        this.initView()

        callback();
    }

    /**
     * Initialize View for API
     */
    initView() {
        this.setView(View.jsonView());
    }

    /**
     * Calculates current data page
     *
     * @returns Number
     */
    getCurrentPage() {
        if (this.request.query && this.request.query.page) {
            return parseInt(this.request.query.page, 10);
        }

        return 1;
    }

    /**
     * Calculates page size for current request
     *
     * @returns Number
     */
    getPageSize() {
        var result = this.defaultPageSize;

        // Check page sizing parameters in the query
        if (this.request.query && this.request.query.limit) {
            var limit = parseInt(this.request.query.limit, this.defaultPageSize);

            if (limit > this.maxPageSize) {
                limit = this.maxPageSize;
            }

            if (limit === 0) {
                limit = 1;
            }

            result = limit;
        }

        return result;
    }

    /**
     * Returns pagination object
     *
     * @returns {{}}
     */
    getPagination() {
        return {
            currentPage: this.getCurrentPage(),
            pageSize: this.getPageSize()
        };
    }

    /**
     * Returns filters
     *
     * @todo Apply proper filtering
     * @returns {{}}
     */
    getFilters() {
        var result = {
            search: {
                searchFields: [],
                searchValue: null
            }
        };
        if (this.model.responseFields) {
            this.model.responseFields.forEach(function (field) {
                if (this.request.query.filter && typeof this.request.query.filter[field] !== 'undefined') {
                    result.search.searchFields.push(field);
                    result.search.searchValue = this.request.query.filter[field];
                }
            }.bind(this));
        }

        // Return empty filters as of now
        return {};
    }

    /**
     * Returns Sorting
     *
     * @todo Apply proper sorting
     * @returns {{}}
     */
    getSort() {
        var result = {};

        return result;
    }

    /**
     * Initialize main actions
     *
     * @param readyCallback
     * @abstract
     */
    load(readyCallback) {
        if (this.request.params.id) {
            this.loadItem(readyCallback);
        } else {
            this.loadItems(readyCallback);
        }
    }

    /**
     * Load single item and return data
     *
     * @param readyCallback
     */
    loadItem(readyCallback) {
        var itemId = this.request.params.id.substring(0, 24);

        this.model.findById(itemId, (error, item) => {
            if (error) {
                this.logger.error(error);
                this.getView().error = {message: "Failed to load item from data source"};

                return readyCallback(error);
            }

            this.getView().data = item;
            readyCallback();
        }, this.modelPopulateFields);
    }

    /**
     * Load list of items
     *
     * @param readyCallback
     */
    loadItems(readyCallback) {
        var populations = this.modelPopulateFields;
        var pagination = this.getPagination();
        var filters = this.getFilters();
        var sort = this.getSort();

        var responseData = {};
        responseData.currentPage = pagination.currentPage;
        responseData.pageSize = pagination.pageSize;
        responseData.sort = sort;
        responseData.filters = filters;

        async.series([
            asyncCallback => {
                this.model.getListCount(filters, (error, itemsCount) => {
                    if (error) {
                        this.logger.error(error);
                        this.getView().error = {message: "Failed to get items count"};

                        return readyCallback(error);
                    }

                    responseData.totalCount = itemsCount;
                    responseData.totalPages = Math.ceil(itemsCount / pagination.pageSize);
                    asyncCallback();
                });
            },
            asyncCallback => {

                this.model.getList(filters, populations, pagination, sort, (error, items) => {
                    if (error) {
                        this.logger.error(error);
                        this.getView().error = {message: "Failed to get items list"};

                        return readyCallback(error);
                    }

                    responseData.items = items;
                    asyncCallback();
                });
            }
        ], (error) => {
            if (error) {
                // Something went wrong. Action is failed.
            } else {
                // OK
                this.getView().data = responseData;
            }

            readyCallback(error);
        });
    }

    /**
     * Insert single item and return data
     *
     * @param readyCallback
     */
    insertItem(readyCallback) {
        readyCallback(new Error("Insert method is not implemented"));
    }

    /**
     * Update single item and return data
     *
     * @param readyCallback
     */
    updateItem(readyCallback) {
        readyCallback(new Error("Update method is not implemented"));
    }

    /**
     * Delete single item and return data
     *
     * @param readyCallback
     */
    deleteItem(readyCallback) {
        readyCallback(new Error("Delete method is not implemented"));
    }
}

/**
 * Exporting Controller
 *
 * @type {Function}
 */
exports = module.exports = APIController;
