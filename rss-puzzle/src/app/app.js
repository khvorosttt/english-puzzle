'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const LoginView_1 = __importDefault(require('./View/Login/LoginView'));
const base_methods_1 = require('./base-methods');
class App {
    constructor() {
        this.container = document.body;
        this.createView();
    }
    createView() {
        const login = new LoginView_1.default();
        (0, base_methods_1.isNull)(login.container);
        this.container.append(login.container);
    }
}
exports.default = App;
