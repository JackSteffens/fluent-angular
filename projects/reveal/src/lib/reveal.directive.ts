import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {RevealService} from './reveal.service';

@Directive({
  selector: '[fluentReveal]',
})
export class FluentRevealDirective implements OnInit, OnDestroy {
  private borderElement;
  private shouldRender = true;
  private mouseMoveListener: () => void;
  private mouseOutListener: () => void;

  @Input()
  public revealThickness = 1; // Larger than 0
  @Input()
  private revealBorderColor = 'transparent'; // Can be any color name, #HEX value or RGB(A) function (all as strings)
  @Input()
  public revealRadialColor = '#807f7f'; // Can be any color name, #HEX value or RGB(A) function (all as strings)
  @Input()
  public revealMargin = 0; // Larger or equal to 0
  @Input()
  public revealRadialDiameter = 100; // Larger than 0
  @Input()
  public parentElement: string;

  constructor(private hostElement: ElementRef,
              private revealService: RevealService) {
  }

  /**
   * Returns the bounding box position of the host element relative to the viewport
   */
  getHostElementEdges(): { left: number, right: number, top: number, bottom: number } {
    return {
      left: this.hostElement.nativeElement.getBoundingClientRect().left,
      right: this.hostElement.nativeElement.getBoundingClientRect().right,
      top: this.hostElement.nativeElement.getBoundingClientRect().top,
      bottom: this.hostElement.nativeElement.getBoundingClientRect().bottom
    };
  }

  /**
   * Checks whether the radial will be visible based on the mouse position,
   * radial diameter, host element size and border thickness.
   */
  isCursorInRange(mousePositionX: number, mousePositionY: number): boolean {
    const edges = this.getHostElementEdges();
    const diameter = this.revealRadialDiameter;
    const thickness = this.revealThickness * 2;

    return fitsVertically() && fitsHorizontally();

    function fitsHorizontally(): boolean {
      return (mousePositionX + diameter) >= (edges.left - thickness) && (mousePositionX - diameter) <= (edges.right + thickness);
    }

    function fitsVertically(): boolean {
      return (mousePositionY + diameter) >= (edges.top - thickness) && (mousePositionY - diameter) <= (edges.bottom + thickness);
    }
  }

  /**
   * Sets the border element's background style, but only if it's allowed to render
   */
  renderRevealBorder(backgroundStyleValue: string) {
    if (this.shouldRender) {
      this.revealService.setElementBackground(this.borderElement, backgroundStyleValue);
    }
  }

  /**
   * Set the border element's background to its initial/default background color
   * then disables future rendering
   */
  clearRevealBorder() {
    this.renderRevealBorder(this.revealBorderColor);
    this.shouldRender = false;
  }

  /**
   * Decides how the border element's background should be rendered
   * based on the mouse event's position coordinates
   * @param mousePositionX the X coordinate relative to the view port
   * @param mousePositionY the Y coordinate relative to the view port
   */
  validatePositionAndRenderRevealBorder(mousePositionX: number, mousePositionY: number) {
    const elementPositionX = this.hostElement.nativeElement.getBoundingClientRect().left;
    const elementPositionY = this.hostElement.nativeElement.getBoundingClientRect().top;

    if (this.isCursorInRange(mousePositionX, mousePositionY)) {
      const radialCenterPositionX = this.revealService.getRadialCenterPoint(elementPositionX, mousePositionX);
      const radialCenterPositionY = this.revealService.getRadialCenterPoint(elementPositionY, mousePositionY);
      const gradientValue = this.revealService.getRadialStyleValue(this.revealRadialDiameter,
        radialCenterPositionX,
        radialCenterPositionY,
        this.revealRadialColor,
        this.revealBorderColor
      );
      this.shouldRender = true;
      this.renderRevealBorder(gradientValue);
    } else {
      this.clearRevealBorder();
    }
  }

  /**
   * Prepares the host element, creates a border element, clips said border element, and appends the border to the host.
   */
  private initRevealEffect() {
    this.revealService.prepHostElementForReveal(this.hostElement.nativeElement, this.revealThickness, this.revealMargin);
    this.borderElement = this.revealService.constructBorderElement(this.revealThickness, this.revealBorderColor);
    this.revealService.clipBorderElementFrameShape(this.borderElement, this.revealThickness);
    this.revealService.appendBorderElementToHostElement(this.hostElement.nativeElement, this.borderElement);
  }

  private initMouseEventListeners() {
    let elem;
    if (this.parentElement) {
      elem = document.getElementById(this.parentElement);
    } else {
      elem = document;
    }

    if (elem) {
      this.mouseMoveListener = elem.addEventListener('mousemove', event => {
        this.validatePositionAndRenderRevealBorder(event.x, event.y);
      });

      this.mouseOutListener = elem.addEventListener('mouseout', () => {
        this.clearRevealBorder();
      });
    } else {
      console.warn('Could not find element with id :', this.parentElement);
    }
  }

  ngOnInit() {
    this.initMouseEventListeners();
    this.initRevealEffect();
  }

  ngOnDestroy(): void {
    destroyListener(this.mouseMoveListener);
    destroyListener(this.mouseOutListener);

    function destroyListener(listenerDestroyer: () => void) {
      if (listenerDestroyer) {
        listenerDestroyer();
        listenerDestroyer = null;
      }
    }
  }
}
