exports.id = "server";
exports.modules = {

/***/ "./src/server/index.tsx":
/*!******************************!*\
  !*** ./src/server/index.tsx ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
const http = __webpack_require__(/*! http */ "http");
function server(devServer) {
    const app = devServer || new Koa();
    app.use((ctx) => __awaiter(this, void 0, void 0, function* () {
        // console.log(34)
        ctx.body = 'hello';
    }));
    http.createServer((req, res) => {
        devServer
            ? devServer.callback()(req, res)
            : app.callback()(req, res);
    }).listen(3000, () => {
        console.info(`The server is running at http://localhost:${3000}/`);
    });
}
exports.default = server;


/***/ })

};
//# sourceMappingURL=server.fbb94243c30b95c757a8.hot-update.js.map