import {Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {RevealService} from './reveal.service';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[fluentReveal]',
})
export class FluentRevealDirective implements OnInit, OnDestroy, OnChanges {
  private borderElement;
  private shouldRender = true;
  private mouseMoveSubscription: Subscription;
  private mouseLeaveSubscription: Subscription;

  @Input()
  public fluentReveal = true;
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
    this.revealService.optimizeCSSChanges(this.borderElement);
    this.revealService.appendBorderElementToHostElement(this.hostElement.nativeElement, this.borderElement);
  }

  /**
   * TODO jsdoc
   */
  private initMouseEventListeners() {
    const element: Element | Document = this.parentElement ? document.getElementById(this.parentElement) : document;
    if (element) {
      this.mouseLeaveSubscription = this.revealService
        .getMouseLeaveEventObservable(element)
        .subscribe(() => {
          this.clearRevealBorder();
        });

      this.mouseMoveSubscription = this.revealService
        .getMouseOverEventObservable(element)
        .subscribe((event: MouseEvent) => {
          if (event) {
            this.validatePositionAndRenderRevealBorder(event.clientX, event.clientY);
          }
        });
    } else {
      console.warn('Could not find element with id :', this.parentElement);
    }
  }

  /**
   * TODO Add jsdoc
   */
  destroyListeners() {
    unsubscribeFromObservable(this.mouseMoveSubscription);
    unsubscribeFromObservable(this.mouseLeaveSubscription);

    const elem = this.parentElement ? document.getElementById(this.parentElement) : document;
    this.revealService.cleanupRevealEventListener(elem);

    function unsubscribeFromObservable(subscription: Subscription) {
      subscription.unsubscribe();
      subscription = null;
    }
  }

  /**
   * TODO jsdoc
   */
  toggleRevealOff(): void {
    this.fluentReveal = false;
    if (this.borderElement) {
      this.destroyListeners();
      this.clearRevealBorder();
    }
  }

  /**
   * TODO jsdoc
   */
  toggleRevealOn(): void {
    this.fluentReveal = true;
    if (this.borderElement) {
      this.initMouseEventListeners();
    }
  }

  ngOnInit() {
    this.initRevealEffect();
    if (this.fluentReveal) {
      this.initMouseEventListeners();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const revealEnabled: boolean = changes.fluentReveal ? changes.fluentReveal.currentValue : this.fluentReveal;
    if (changes.fluentReveal && revealEnabled === false) {
      this.toggleRevealOff();
    } else if (changes.fluentReveal) { // true or null (no value on attribute means ON)
      this.toggleRevealOn();
    }

    if (changes.revealThickness && this.borderElement) {
      this.revealService.prepHostElementForReveal(this.hostElement.nativeElement, this.revealThickness, this.revealMargin);
      this.revealService.clipBorderElementFrameShape(this.borderElement, this.revealThickness);
    }

    if (changes.revealMargin && this.borderElement) {
      this.revealService.prepHostElementForReveal(this.hostElement.nativeElement, this.revealThickness, this.revealMargin);
    }
  }

  ngOnDestroy(): void {
    this.destroyListeners();
  }
}
