import {Directive, ElementRef, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {RevealService} from './reveal.service';

@Directive({
  selector: '[fluentReveal]',
})
export class FluentRevealDirective implements OnInit {
  private borderElement;
  private shouldRender = true;
  @Input()
  public revealThickness = 1;
  @Input()
  private revealBorderColor = 'transparent';
  @Input()
  public revealRadialColor = '#807f7f';
  @Input()
  public revealMargin = 0;
  @Input()
  public revealRadialSize = 100;

  @HostListener('document:mousemove', ['$event'])
  onMouseMoved(ev) {
    this.renderRevealBorder(ev.x, ev.y);
  }

  constructor(private hostElement: ElementRef,
              private renderer: Renderer2,
              private revealService: RevealService) {
  }

  isCursorInRange(mousePositionX: number, mousePositionY: number): boolean {
    const radius = this.revealRadialSize;
    return this.fitsVertically(mousePositionY, radius) && this.fitsHorizontally(mousePositionX, radius);
  }

  fitsHorizontally(mousePositionX: number, radius: number): boolean {
    const left = this.hostElement.nativeElement.getBoundingClientRect().left;
    const right = this.hostElement.nativeElement.getBoundingClientRect().right;
    return (mousePositionX + radius) >= left && (mousePositionX - radius <= right);
  }

  fitsVertically(mousePositionY: number, radius: number): boolean {
    const top = this.hostElement.nativeElement.getBoundingClientRect().top;
    const bottom = this.hostElement.nativeElement.getBoundingClientRect().bottom;
    return (mousePositionY + radius) >= top && (mousePositionY - radius) <= bottom;
  }

  private renderRevealBorder(mousePositionX: number, mousePositionY: number) {
    const elementPositionX = this.hostElement.nativeElement.getBoundingClientRect().left;
    const elementPositionY = this.hostElement.nativeElement.getBoundingClientRect().top;

    const radialX = this.revealService.getRadialPosition(elementPositionX, mousePositionX);
    const radialY = this.revealService.getRadialPosition(elementPositionY, mousePositionY);

    let gradientValue = this.revealBorderColor; // Default value when cursor is not in range
    let isInRange = true;

    if (this.isCursorInRange(mousePositionX, mousePositionY)) {
      this.shouldRender = true;
      gradientValue = this.revealService.getRadialStyleValue(this.revealRadialSize,
        radialX,
        radialY,
        this.revealRadialColor,
        this.revealBorderColor
      );
      isInRange = true;
    } else {
      isInRange = false;
    }

    if (this.shouldRender) {
      this.renderer.setStyle(
        this.borderElement,
        'background',
        gradientValue
      );
      this.shouldRender = isInRange;
    }

  }

  private createRevealWrapper() {
    // Creating border element
    this.borderElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.borderElement, 'width', '100%');
    this.renderer.setStyle(this.borderElement, 'height', '100%');
    this.renderer.setStyle(this.borderElement, 'padding', `${this.revealThickness}px`);
    this.renderer.setStyle(this.borderElement, 'background-color', 'green');
    this.renderer.setStyle(this.borderElement, 'position', 'absolute');
    this.renderer.setStyle(this.borderElement, 'top', `-${this.revealThickness}px`);
    this.renderer.setStyle(this.borderElement, 'left', `-${this.revealThickness}px`);
    this.renderer.setStyle(this.borderElement, 'z-index', '-1');

    // Appending border
    const element = this.hostElement.nativeElement;
    this.renderer.setStyle(element, 'position', 'relative');
    this.renderer.setStyle(element, 'margin', `${this.revealThickness + this.revealMargin}px`);

    // Border Clipping
    const topLeft = `${this.revealThickness}px ${this.revealThickness}px`;
    const topRight = `calc(100% + -${this.revealThickness}px) ${this.revealThickness}px`;     // 75% 25%
    const bottomRight = `calc(100% + -${this.revealThickness}px) calc(100% + -${this.revealThickness}px)`;  // 75% 75%
    const bottomLeft = `${this.revealThickness}px calc(100% + -${this.revealThickness}px)`;   // 25% 75%
    const endStitch = `${this.revealThickness}px calc(100% + ${(this.revealThickness)}px)`;   // 25% 100%

    this.renderer.setStyle(
      this.borderElement,
      'clip-path',
      `polygon(
      0px 0px,
      0px calc(100% + ${(this.revealThickness * 2)}px),
      ${endStitch},
      ${topLeft},
      ${topRight},
      ${bottomRight},
      ${bottomLeft},
      ${endStitch},
      calc(100% + ${(this.revealThickness * 2)}px) 100%,
      calc(100% + ${(this.revealThickness * 2)}px) 0px
      )`
    );
    this.renderer.appendChild(this.hostElement.nativeElement, this.borderElement);

  }

  ngOnInit() {
    this.createRevealWrapper();
  }
}
