// src/components/Views/GalleryView.ts
import { Component } from "../../components/base/Component";

type GalleryData = { catalog?: HTMLElement[] };

export class GalleryView extends Component<GalleryData> {
  private galleryEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.galleryEl = container;
  }

  set catalog(items: HTMLElement[]) {
    this.galleryEl.replaceChildren(...items);
  }

  render(): HTMLElement {
    return this.galleryEl;
  }
}
