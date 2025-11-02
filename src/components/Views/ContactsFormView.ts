// src/components/Views/ContactsFormView.ts
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

    this.emailInput.addEventListener("input", this.onInput);
    this.phoneInput.addEventListener("input", this.onInput);
    this.formEl.addEventListener("submit", this.onSubmit);

    this.updateState();
  }

  private onInput = () => {
    this.updateState();
    eventBus.emit("view:form:change", {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    });
  };

  private onSubmit = (e: Event) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!this.emailInput.value.trim()) errors.email = "Введите Email";
    if (!this.phoneInput.value.trim()) errors.phone = "Введите телефон";

    if (Object.keys(errors).length) {
      this.errorsEl.textContent = Object.values(errors).join("; ");
      return;
    }

    eventBus.emit("view:order:submit", {
      email: this.emailInput.value.trim(),
      phone: this.phoneInput.value.trim(),
    });
  };

  private updateState() {
    const hasEmail = !!this.emailInput.value.trim();
    const hasPhone = !!this.phoneInput.value.trim();
    const isFormValid = hasEmail && hasPhone;

    this.payBtn.disabled = !isFormValid;
    this.errorsEl.textContent = "";
  }
}
