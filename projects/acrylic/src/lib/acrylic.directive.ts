import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import html2canvas from 'html2canvas';

let sequenceNumber = 0;

@Directive({
  selector: '[fluentAcrylic]'
})
export class FluentAcrylicDirective implements OnInit {
  private offsetVertical: number;
  private offsetHorizontal: number;
  private parentElement;
  private hostElement;
  private acrylicBlurElement;
  private acrylicNoiseElement;
  private acrylicColorElement;
  private acrylicWrapperElement;
  private uniqueId = `fluent-acrylic-${++sequenceNumber}`;

  @Input() acrylicParentElementId: string;
  @Input() acrylicPosition = 'relative';
  @Input() acrylicOpacity = 0.2;
  @Input() acrylicIntensity = 5;
  @Input() acrylicColor = 'white';

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  applyBlurEffect(): void {
    // Fallback background color
    this.renderer.setStyle(this.acrylicBlurElement, 'filter', `blur(${this.acrylicIntensity}px)`);
    this.renderer.setStyle(this.acrylicBlurElement, 'z-index', '0');

    // TODO Check if this can be run in a service worker
    // setTimeout(() => {
    html2canvas(this.parentElement, {
      ignoreElements: (element) => {
        return element.id === this.uniqueId;
      }
    }).then((canvas) => {
      this.acrylicBlurElement.appendChild(canvas);
      this.initOffsetNumbers();
      this.renderer.setStyle(this.acrylicBlurElement, 'left', `${this.offsetHorizontal}px`);
      this.renderer.setStyle(this.acrylicBlurElement, 'top', `${this.offsetVertical}px`);
    }, (error) => {
      console.error('Whoops', error);
    });
    // }, 1000);

  }

  applyNoiseEffect(): void {
    this.renderer.setStyle(
      this.acrylicNoiseElement,
      'background-image',
      'url(data:image/png;base64,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)'
    );
    this.renderer.setStyle(this.acrylicNoiseElement, 'z-index', '1');
  }

  /**
   * TODO Take color from @Input, default white
   */
  applyColorEffect(): void {
    this.renderer.setStyle(this.acrylicColorElement, 'background-color', `rgba(255, 255, 255, ${this.acrylicOpacity})`);
    this.renderer.setStyle(this.acrylicColorElement, 'z-index', '2');
  }

  private getParentElement() {
    let elem;
    if (this.acrylicParentElementId) {
      elem = document.getElementById(this.acrylicParentElementId);
    } else {
      console.warn('⚠ Fluent Acrylic -'
        , `Acrylic background is bound to the entire Document.
        Although functional, it is not recommended as copying and blurring the entire
        document is resource heavy. Consider supplying [acrylicParentElementId]="elementId"
        to the acrylic element to make it target a specific parent element.`);
      elem = document.body.getElementsByTagName('app-root')[0]; // FIXME Don't target app-root with the hardcoded string/name
    }
    return elem;
  }

  initGenericElement() {
    const genericElement = this.renderer.createElement('div');
    this.renderer.setStyle(genericElement, 'width', '100%');
    this.renderer.setStyle(genericElement, 'height', '100%');
    this.renderer.setStyle(genericElement, 'position', 'absolute');
    this.renderer.setStyle(genericElement, 'top', '0');
    this.renderer.setStyle(genericElement, 'left', '0');
    return genericElement;
  }

  /**
   * FIXME Something goes wrong when the user scrolls before the canvas is rendered
   * Staying un-scrolled for a while makes everything seem as it should
   */
  initOffsetNumbers() {
    const parentBoundingBox = this.parentElement.getBoundingClientRect();
    const hostBoundingBox = this.hostElement.getBoundingClientRect();
    const scrollVertical = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHorizontal = window.pageXOffset || document.documentElement.scrollLeft;
    this.offsetHorizontal = (parentBoundingBox.left - hostBoundingBox.left - scrollHorizontal);
    this.offsetVertical = (parentBoundingBox.top - hostBoundingBox.top - scrollVertical);
    console.log('offsetHorizontal', this.offsetHorizontal);
    console.log('offsetVertical', this.offsetVertical);
  }

  initNecessaryElements() {
    // Blur element
    this.acrylicBlurElement = this.initGenericElement();
    this.applyBlurEffect();

    // Noise element
    this.acrylicNoiseElement = this.initGenericElement();
    this.applyNoiseEffect();

    // Color element
    this.acrylicColorElement = this.initGenericElement();
    this.applyColorEffect();

    // Wrapper element
    this.acrylicWrapperElement = this.initGenericElement();
    this.renderer.setStyle(this.acrylicWrapperElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.acrylicWrapperElement, 'overflow', 'hidden');
    this.renderer.setStyle(this.acrylicWrapperElement, 'z-index', '-1');

    // Add elements (blur first so that it's on the bottom)
    this.renderer.appendChild(this.acrylicWrapperElement, this.acrylicBlurElement);
    this.renderer.appendChild(this.acrylicWrapperElement, this.acrylicNoiseElement);
    this.renderer.appendChild(this.acrylicWrapperElement, this.acrylicColorElement);

    this.renderer.appendChild(this.hostElement, this.acrylicWrapperElement);
  }

  ngOnInit() {
    // Parent
    this.parentElement = this.getParentElement();

    // Host element
    this.hostElement = this.elementRef.nativeElement;
    this.renderer.setAttribute(this.hostElement, 'id', this.uniqueId);
    this.renderer.setStyle(this.hostElement, 'position', this.acrylicPosition);
    this.renderer.setStyle(this.hostElement, 'z-index', '0');

    this.initNecessaryElements();
  }
}
