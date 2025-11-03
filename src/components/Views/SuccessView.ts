// src/components/Views/SuccessView.ts
import { Component } from "../../components/base/Component";

export class SuccessView extends Component<{}> {
  render(): HTMLElement {
    const tpl = document.getElementById("success") as HTMLTemplateElement;
    const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement;
    return node;
  }
}