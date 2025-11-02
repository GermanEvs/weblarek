// src/components/Views/OrderFormView.ts
import { Component } from "../../components/base/Component";
import { eventBus } from "../../utils/event-bus";
import { TPayment } from "../../types";

export class OrderFormView extends Component<{}> {
  private formEl: HTMLFormElement;
  private paymentBtns: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;
  private nextBtn: HTMLButtonElement;
  private errorsEl: HTMLElement;

  private selectedPayment: TPayment | null = null;

  constructor(container: HTMLElement) {
    super(container);

    this.formEl = container as HTMLFormElement;
    this.paymentBtns = container.querySelectorAll(
      ".order__buttons .button_alt"
    );
    this.addressInput = container.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;
    this.nextBtn = container.querySelector(
      ".order__button"
    ) as HTMLButtonElement;
    this.errorsEl = container.querySelector(".form__errors") as HTMLElement;

    this.paymentBtns.forEach((btn) => {
      btn.addEventListener("click", this.onPaymentClick);
    });

    this.addressInput.addEventListener("input", this.onInput);
    this.formEl.addEventListener("submit", this.onSubmit);

    this.updateState();
  }

  private onPaymentClick = (e: Event) => {
    const btn = e.currentTarget as HTMLButtonElement;
    this.selectedPayment = btn.name as TPayment;

    this.paymentBtns.forEach((b) => {
      b.classList.toggle("button_alt-active", b === btn);
    });

    this.updateState();
    this.emitFormChange();
  };

  private onInput = () => {
    this.updateState();
    this.emitFormChange();
  };

  private onSubmit = (e: Event) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!this.selectedPayment) errors.payment = "Выберите способ оплаты";
    if (!this.addressInput.value.trim()) errors.address = "Введите адрес";

    if (Object.keys(errors).length) {
      this.errorsEl.textContent = Object.values(errors).join("; ");
      return;
    }

    eventBus.emit("view:order:next", {
      payment: this.selectedPayment,
      address: this.addressInput.value.trim(),
    });
  };

  private emitFormChange() {
    eventBus.emit("view:form:change", {
      payment: this.selectedPayment,
      address: this.addressInput.value.trim(),
    });
  }

  private updateState() {
    const hasPayment = !!this.selectedPayment;
    const hasAddress = !!this.addressInput.value.trim();
    const isFormValid = hasPayment && hasAddress;

    this.nextBtn.disabled = !isFormValid;
    this.errorsEl.textContent = "";
  }
}
