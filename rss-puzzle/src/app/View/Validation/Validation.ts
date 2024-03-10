export default class ValidationForm {
    static invalidListenner(element: HTMLInputElement) {
        if (element.validity.valueMissing) {
            element.setCustomValidity('Is a required input field');
        }
    }

    static inputListenner(element: HTMLInputElement, label: HTMLLabelElement) {
        const errorLabel = label;
        errorLabel.textContent = '';
        element.setCustomValidity('');
        if (element.validity.tooShort) {
            errorLabel.textContent += `The minimum name length is ${element.minLength} characters.`;
            element.setCustomValidity(' ');
        } else if (element.validity.patternMismatch) {
            errorLabel.textContent +=
                'Start typing with a capital letter. Acceptable characters are the English alphabet and the «-» symbol.';
        }
    }

    static setInputListeners(element: HTMLInputElement, label: HTMLLabelElement) {
        element.addEventListener('invalid', () => ValidationForm.invalidListenner(element));
        element.addEventListener('input', () => ValidationForm.inputListenner(element, label));
    }
}
