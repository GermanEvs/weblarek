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
      btn.addEventListener("click", () => this.onPaymentClick(btn));
    });

    this.addressInput.addEventListener("input", this.onInput.bind(this));
    this.formEl.addEventListener("submit", this.onSubmit.bind(this));
  }

  setData(payment: TPayment | null | undefined, address: string | undefined) {
    this.selectedPayment = payment || null;
    this.paymentBtns.forEach((btn) => {
      btn.classList.toggle("button_alt-active", btn.name === payment);
    });
    this.addressInput.value = address || '';
  }

  setErrors(errors: string[]) {
    this.errorsEl.textContent = errors.join("; ");
  }

  setValid(valid: boolean) {
    this.nextBtn.disabled = !valid;
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  private onPaymentClick(btn: HTMLButtonElement) {
    this.selectedPayment = btn.name as TPayment;
    this.paymentBtns.forEach(b => {
      b.classList.toggle("button_alt-active", b === btn);
    });
    this.emitFormChange();
  }

  private onInput() {
    this.emitFormChange();
  }

  private onSubmit(e: Event) {
    e.preventDefault();
    eventBus.emit("view:order:next", {
      payment: this.selectedPayment,
      address: this.addressInput.value
    });
  }

  private emitFormChange() {
    eventBus.emit("view:form:change", {
      payment: this.selectedPayment,
      address: this.addressInput.value
    });
  }
}