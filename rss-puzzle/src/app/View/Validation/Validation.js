'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
class ValidationForm {
    static inputListenner(element, label) {
        const errorLabel = label;
        errorLabel.textContent = '';
        console.log('kih');
        element.setCustomValidity('jijiji');
        if (element.validity.valueMissing) {
            console.log('kih');
            element.setCustomValidity('jijiji');
        }
        if (element.validity.tooShort) {
            errorLabel.textContent += `The minimum name length is ${element.minLength} characters.`;
        }
    }
    static setInputListenners(element, label) {
        element.addEventListener('input', () => ValidationForm.inputListenner(element, label));
    }
}
exports.default = ValidationForm;
