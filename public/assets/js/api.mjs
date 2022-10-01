/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/assets/js/api.ts":
/*!******************************!*\
  !*** ./src/assets/js/api.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ ApiClient)\n/* harmony export */ });\nclass ApiClient {\r\n    constructor(socket) {\r\n        this.socket = socket;\r\n    }\r\n    /**\r\n     * @param {Array} messageList\r\n     * @return {void}\r\n     */\r\n    getRoomInfo(messageList) {\r\n        this.socket.on(\"queryGetRoomInfo\", (list) => {\r\n            messageList.value = list;\r\n        });\r\n    }\r\n    /**\r\n     * @param {object} messageList\r\n     * @return {void}\r\n     */\r\n    putChatMessage(roomName, newMessage) {\r\n        this.socket.emit('queryPutChatMessage', [roomName, newMessage]);\r\n    }\r\n    /**\r\n     * @return {void}\r\n     */\r\n    requestAllDataStoredInServer() {\r\n        this.socket.emit('queryRequestAllDataStoredInServer');\r\n    }\r\n    /**\r\n     * @param {object} myClient\r\n     * @return {void}\r\n     */\r\n    putMyClient(myClient) {\r\n        this.socket.emit('queryPutMyClient', myClient);\r\n    }\r\n    /**\r\n     * @param {string} targetRoom\r\n     * @return {void}\r\n     */\r\n    putRoomInfo(targetRoom) {\r\n        this.socket.emit('queryPutRoomInfo', targetRoom);\r\n    }\r\n    /**\r\n     * @param {string} targetRoom\r\n     * @return {void}\r\n     */\r\n    requestRoomInfo(targetRoom) {\r\n        this.socket.emit('queryRequestRoomInfo', targetRoom);\r\n    }\r\n    /**\r\n   * @param {string} targetUser\r\n   * @param {string} targetPath\r\n     * @return {void}\r\n     */\r\n    putNewIconForMessages(targetUser, targetPath) {\r\n        this.socket.emit('queryPutNewIconForMessages', targetUser, targetPath);\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://snow-chat/./src/assets/js/api.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/assets/js/api.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;