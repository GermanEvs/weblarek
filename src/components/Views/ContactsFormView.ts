import { Component } from "../../components/base/Component";
import { eventBus } from "../../utils/event-bus";

export class ContactsFormView extends Component<{}> {
  private formEl: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private payBtn: HTMLButtonElement;
  private errorsEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.formEl = container as HTMLFormElement;
    this.emailInput = container.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    this.phoneInput = container.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;
    this.payBtn = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    this.errorsEl = container.querySelector(".form__errors") as HTMLElement;

    // ✅ Исправляем привязку контекста
    this.onInput = this.onInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.emailInput.addEventListener("input", this.onInput);
    this.phoneInput.addEventListener("input", this.onInput);
    this.formEl.addEventListener("submit", this.onSubmit);
  }

  private onInput() {
    // ✅ Эмитим события при вводе в форму контактов
    eventBus.emit("view:form:change", {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    });
  }

  private onSubmit(e: Event) {
    e.preventDefault();
    eventBus.emit("view:order:submit", {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    });
  }

  setData(email: string | undefined, phone: string | undefined) {
    this.emailInput.value = email || '';
    this.phoneInput.value = phone || '';
  }

  setErrors(errors: string[]) {
    this.errorsEl.textContent = errors.join("; ");
  }

  setValid(valid: boolean) {
    this.payBtn.disabled = !valid;
  }

  getContainer(): HTMLElement {
    return this.container;
  }
}