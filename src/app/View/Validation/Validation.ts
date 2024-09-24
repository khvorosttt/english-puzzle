import { Router } from '../../Router/Router';

export interface UserType {
    nameUser: string;
    surnameUser: string;
}

export default class ValidationForm {
    static user: UserType = {
        nameUser: '',
        surnameUser: '',
    };

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
            element.setCustomValidity(' ');
        }
        if (element.checkValidity()) {
            if (element.id === 'name') {
                ValidationForm.user.nameUser = element.value;
            } else if (element.id === 'surname') {
                ValidationForm.user.surnameUser = element.value;
            }
        }
    }

    static setInputListeners(element: HTMLInputElement, label: HTMLLabelElement) {
        element.addEventListener('invalid', () => ValidationForm.invalidListenner(element));
        element.addEventListener('input', () => ValidationForm.inputListenner(element, label));
    }

    static formListener(event: Event, router: Router) {
        event.preventDefault();
        localStorage.clear();
        localStorage.setItem('user', JSON.stringify(ValidationForm.user));
        router.navigate('start');
    }

    static setFormListeners(form: HTMLFormElement, router: Router) {
        form.addEventListener('submit', (event: Event) => ValidationForm.formListener(event, router));
    }
}
