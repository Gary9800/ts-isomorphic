module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "../chunk-manifest.json":
/*!*****************************************!*\
  !*** external "../chunk-manifest.json" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("../chunk-manifest.json");

/***/ }),

/***/ "./src/Html.tsx":
/*!**********************!*\
  !*** ./src/Html.tsx ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
class Html extends React.Component {
    render() {
        const { title, styles = [], scripts = [], children } = this.props;
        return React.createElement("html", { className: "no-js", lang: "en" },
            React.createElement("head", null,
                React.createElement("meta", { charSet: "utf-8" }),
                React.createElement("meta", { httpEquiv: "x-ua-compatible", content: "ie=edge" }),
                React.createElement("title", null, title),
                React.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
                scripts.map(script => (React.createElement("link", { key: script, rel: "preload", href: script, as: "script" }))),
                styles.map(style => (React.createElement("link", { key: style, rel: "stylesheet", href: style })))),
            React.createElement("body", null,
                React.createElement("div", { id: "app", dangerouslySetInnerHTML: { __html: children } }),
                scripts.map(script => React.createElement("script", { key: script, src: script }))));
    }
}
exports.default = Html;


/***/ }),

/***/ "./src/components/App/App.scss":
/*!*************************************!*\
  !*** ./src/components/App/App.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
module.exports = {"root":"src-components-App-_root"};

/***/ }),

/***/ "./src/components/App/index.tsx":
/*!**************************************!*\
  !*** ./src/components/App/index.tsx ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../../global.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const root_1 = __webpack_require__(/*! react-hot-loader/root */ "react-hot-loader/root");
const styles = __webpack_require__(/*! ./App.scss */ "./src/components/App/App.scss");
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("div", { className: styles.root },
            React.createElement("div", null, "hh"),
            this.props.children);
    }
}
let HotApp = App;
if (false) {}
exports.default = HotApp;


/***/ }),

/***/ "./src/components/Test/index.tsx":
/*!***************************************!*\
  !*** ./src/components/Test/index.tsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(/*! react */ "react");
const root_1 = __webpack_require__(/*! react-hot-loader/root */ "react-hot-loader/root");
function Hello() {
    return React.createElement("div", null, "hello ts!");
}
;
let HotApp = Hello;
if (false) {}
exports.default = HotApp;


/***/ }),

/***/ "./src/server/index.tsx":
/*!******************************!*\
  !*** ./src/server/index.tsx ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../global.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = __webpack_require__(/*! koa */ "koa");
const React = __webpack_require__(/*! react */ "react");
const ReactDOMServer = __webpack_require__(/*! react-dom/server */ "react-dom/server");
const Html_1 = __webpack_require__(/*! ../Html */ "./src/Html.tsx");
const App_1 = __webpack_require__(/*! ../components/App */ "./src/components/App/index.tsx");
const Test_1 = __webpack_require__(/*! ../components/Test */ "./src/components/Test/index.tsx");
const manifest = __webpack_require__(/*! ../chunk-manifest.json */ "../chunk-manifest.json");
function server(devServer) {
    const scripts = new Set();
    const styles = new Set();
    const app = devServer || new Koa();
    console.log(manifest);
    const addChunk = (chunk) => {
        if (manifest[chunk]) {
            manifest[chunk]
                .filter((asset) => asset.endsWith('.js'))
                .forEach((asset) => scripts.add(asset));
            manifest[chunk]
                .filter((asset) => asset.endsWith('.css'))
                .forEach((asset) => styles.add(asset));
        }
        else if (__DEV__) {
            throw new Error(`Chunk with name '${chunk}' cannot be found`);
        }
    };
    app.use((ctx) => __awaiter(this, void 0, void 0, function* () {
        addChunk('client');
        const _styles = Array.from(styles);
        const _scripts = Array.from(scripts);
        const children = ReactDOMServer.renderToString(React.createElement(App_1.default, null,
            React.createElement(Test_1.default, null)));
        ctx.body = ReactDOMServer.renderToStaticMarkup(React.createElement(Html_1.default, { children: children, styles: _styles, scripts: _scripts }));
    }));
    if (!devServer) {
        app.listen(3000, () => {
            console.info(`The server is running at http://localhost:${3000}/`);
        });
    }
}
exports.default = server;


/***/ }),

/***/ 0:
/*!************************************!*\
  !*** multi ./src/server/index.tsx ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/gary/Documents/study/ts-isomorphic/src/server/index.tsx */"./src/server/index.tsx");


/***/ }),

/***/ "koa":
/*!**********************!*\
  !*** external "koa" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-hot-loader/root":
/*!****************************************!*\
  !*** external "react-hot-loader/root" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-hot-loader/root");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map