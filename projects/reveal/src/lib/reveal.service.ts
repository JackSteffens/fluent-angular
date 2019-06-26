import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

interface RevealEventListener {
  element: Element | Document;
  mouseMoveSubject: BehaviorSubject<MouseEvent>;
  mouseLeaveSubject: BehaviorSubject<MouseEvent>;
  destroyListeners: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class RevealService {
  private renderer: Renderer2;
  private listeners: Map<string, RevealEventListener> = new Map();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * TODO Refactor !!!
   * Events emitted by the event listener goes through an Observable, this limits
   * amount of event listeners per element to 1. This improves performance compared to each
   * reveal element creating its own listener
   */
  public getMouseOverEventObservable(element: Document | Element): Observable<MouseEvent> {
    const listenerKey: string = this.getListenerKey(element);

    if (!this.listeners.has(listenerKey)) {
      this.initRevealEventListener(element, listenerKey);
    }

    return this.listeners.get(listenerKey).mouseMoveSubject.asObservable();
  }

  /**
   * Checks for an existing RevealEventListener on the given element, if it doesn't
   * exists it will initialize a new one.
   * Once it has one, it will be returned.
   *
   * @param element can be either an Element or Document object
   */
  public getMouseLeaveEventObservable(element: Document | Element): Observable<MouseEvent> {
    let listenerKey: string;
    listenerKey = this.getListenerKey(element);

    if (!this.listeners.has(listenerKey)) {
      this.initRevealEventListener(element, listenerKey);
    }

    return this.listeners.get(listenerKey).mouseLeaveSubject.asObservable();
  }

  /**
   * Returns the element's ID as its listener key.
   * If the element is of type Document it will return 'document' as a listener key.
   * In the case of no id, it will throw an error.
   *
   * @param element can be either an Element or Document object
   */
  private getListenerKey(element: Document | Element) {
    let listenerKey;
    if (element instanceof Document) {
      listenerKey = 'document';
    } else if (element.id) {
      listenerKey = element.id;
    } else {
      throw Error('Element has no id');
    }
    return listenerKey;
  }

  /**
   * Creates an RevealEventListener reference and stores it in `this.listeners` using the element's id as key.
   * The RevealEventListener object contains a reference to the parent element, two event listeners one for
   * MouseOver and one for MouseLeave, and a function to remove said listeners.
   *
   * @param element Parent Element which the child reveal elements are depended on for mouse event listeners.
   * @param id Since the `element` parameter can accidentally contain an element with no id, or an object of
   * type Document (which never contains an id), the `id` parameter is required. It's used as the key for the
   * map where RevealEventListener references are stored.
   *
   * TODO Use Rx.Observable.fromEvent() instead of addEventListener. This allows for
   * a debounce option so that we don't trigger BehaviourSubject.next() every millisecond.
   */
  private initRevealEventListener(element: Document | Element, id: string): void {
    const mouseMoveSubject: BehaviorSubject<MouseEvent> = new BehaviorSubject(undefined);
    const mouseLeaveSubject: BehaviorSubject<MouseEvent> = new BehaviorSubject(undefined);
    element.addEventListener('mousemove', updateMouseMoveEvent, {passive: true});
    element.addEventListener('mouseleave', updateMouseLeaveEvent, {passive: true});
    this.listeners.set(id, {
      element,
      mouseMoveSubject,
      mouseLeaveSubject,
      destroyListeners
    });

    if (element instanceof Document) {
      console.warn('⚠ Fluent Reveal -',
        `Event listener bound to "document".
           Although functional, it is not recommended as it can deteriorate performance.
           Consider supplying [parentElement]="elementId" to the reveal element to make it target
           a specific parent element.`);
    }

    /**
     * Updates the BehaviourSubject and triggers any Observers with a new MouseMoveEvent
     */
    function updateMouseMoveEvent(event: MouseEvent): void {
      mouseMoveSubject.next(event);
    }

    /**
     * Updates the BehaviourSubject and triggers any Observers with a new MouseLeaveEvent
     */
    function updateMouseLeaveEvent(event: MouseEvent): void {
      mouseLeaveSubject.next(event);
    }

    /**
     * Removes the mousemove and mouseleave event listeners from the given Element or Document
     */
    function destroyListeners(): void {
      element.removeEventListener('mousemove', updateMouseMoveEvent);
      element.removeEventListener('mouseleave', updateMouseLeaveEvent);
    }
  }

  /**
   * When there are no longer any Observers/active subscriptions on the host element's
   * observable event listener, cleanup the default EventListener and delete the RevealEventListener
   * reference in the this.listeners Map object.
   * @param parentElement the parent element the reveal child elements are dependent on for mouse events
   */
  public cleanupRevealEventListener(parentElement: Element | Document) {
    const key = this.getListenerKey(parentElement);
    let listener = this.listeners.get(key);

    if (listener && !listener.mouseLeaveSubject.observers.length) {
      listener.destroyListeners();
      this.listeners.delete(key);
      listener = null;
    }
  }

  /**
   * Transforms the given coordinate point from viewport-relativity to element-relativity
   * The given coordinates must be relative to the view port!
   * @param elementPosition The top left corner X or Y coordinate of the element to be revealed
   * @param mousePosition The X or Y coordinate of the mouse event
   * @return a coordinate relative to the element
   */
  public getRadialCenterPoint(elementPosition, mousePosition): number {
    return 0 - elementPosition + mousePosition;
  }

  /**
   * Constructs the background:radial-gradient() value
   *
   * @param revealRadialSize number represents pixels
   * @param radialX X coordinate of the center point of the radial relative to the host element, not viewport!
   * @param radialY Y coordinate of the center point of the radial relative to the host element, not viewport!
   * @param revealRadialColor must be a color acceptable by CSS standards TODO Modify to accept multiple colors
   * @param revealBorderColor must be a color acceptable by CSS standards
   *        See https://www.w3.org/TR/css-color-4/#typedef-color for color definitions
   */
  public getRadialStyleValue(revealRadialSize: number,
                             radialX: number,
                             radialY: number,
                             revealRadialColor: string,
                             revealBorderColor: string): string {
    return `radial-gradient(
      circle ${revealRadialSize}px
      at ${radialX}px ${radialY}px,
      ${revealRadialColor},
      ${revealBorderColor})`;
    // return `radial-gradient(
    //   circle ${revealRadialSize}px
    //   at ${radialX}px ${radialY}px,
    //   ${revealRadialColor} 10%,
    //   ${revealRadialColor} 50%,
    //   ${revealRadialColor} 75%,
    //   ${revealBorderColor})`;
  }

  /**
   * Creates & prepares a border element responsible for containing the radial glow
   * width & height are equal to the host element's width & height
   * padding will create whitespace around the host's content to create room for the reveal effect
   * background color is the initial non-hover state
   * position is absolute to not conflict with the host's content
   * z-index set to a negative value to not overlap the host's content
   *
   * @param revealThickness number in pixels
   * @param defaultBorderColor any color value accepted by CSS
   *        Color examples :
   *        Name       : red
   *        HEX value  : #FF0000
   *        RGB value  : rgb(255, 0, 0)
   *        RGB +alpha : rgba(255, 0, 0, 0.5)
   *        See https://www.w3.org/TR/css-color-4/#typedef-color for more definitions
   */
  public constructBorderElement(revealThickness: number, defaultBorderColor: string): any {
    const borderElement = this.renderer.createElement('div');
    this.renderer.setStyle(borderElement, 'width', '100%');
    this.renderer.setStyle(borderElement, 'height', '100%');
    // this.renderer.setStyle(borderElement, 'padding', `${revealThickness}px`);
    this.renderer.setStyle(borderElement, 'background-color', defaultBorderColor);
    this.renderer.setStyle(borderElement, 'position', 'absolute');
    this.renderer.setStyle(borderElement, 'top', `0px`);
    this.renderer.setStyle(borderElement, 'left', `0px`);
    this.renderer.setStyle(borderElement, 'z-index', '-1');
    return borderElement;
  }

  /**
   * The host element is required to have its `position` to be `relative` because the
   * border element is going to have it set to `absolute`. If this is not the case,
   * the border element will exceed the host its boundaries until it hits
   * another parent object with `position` set to `relative`.
   *
   * The host element gets a `margin` based on the border's thickness + any given desired
   * extra margin. This is to prevent the reveal border from overlapping onto other elements
   *
   * @param hostElement the elements which the [fluentReveal] attribute is applied onto
   * @param revealThickness a number in pixels
   * @param revealMargin a number in pixels
   */
  public prepHostElementForReveal(hostElement: any, revealThickness: number, revealMargin: number) {
    this.renderer.setStyle(hostElement, 'position', 'relative');
    this.renderer.setStyle(hostElement, 'padding', `${revealThickness}px`);
    this.renderer.setStyle(hostElement, 'margin', `${revealMargin}px`);
  }

  /**
   * TODO : Perhaps swap calc() for a JavaScript implementation
   * The reveal border effect should only be applied around the host element,
   * not anywhere within. This could otherwise conflict with transparent host elements.
   * In order to achieve this, the border element's insides get clipped out using a polygonal shape
   *
   * The shape is as follows : (Each node is indicated with a number and represents the variable name)
   *
   *  1╔══════════════════════╗10    1 :  TOP_LEFT_OUT
   *   ║    [REVEAL BORDER]   ║      2 :  BOTTOM_LEFT_OUT
   *   ║   4╔════════════╗5   ║      3 :  BOTTOM_OUT
   *   ║    ║            ║    ║      4 :  TOP_LEFT_IN
   *   ║    ║ [CONTENT]  ║    ║      5 :  TOP_RIGHT_IN
   *   ║    ║            ║    ║      6 :  BOTTOM_RIGHT_IN
   *   ║    ║            ║    ║      7 :  BOTTOM_LEFT_IN
   *   ║   7╠════════════╝6   ║      8 :  BOTTOM_OUT
   *   ║    ║                 ║      9 :  BOTTOM_RIGHT_OUT
   *  2╚════╩═════════════════╝9    10 :  TOP_RIGHT_OUT
   *       3&8
   */
  clipBorderElementFrameShape(borderElement: any, revealThickness: number) {
    if (this.browserSupportsClipPathPolygon()) {
      const TOP_LEFT_OUT = `0px 0px`;
      const BOTTOM_LEFT_OUT = `0px calc(100% + ${(revealThickness * 2)}px)`;
      const TOP_LEFT_IN = `${revealThickness}px ${revealThickness}px`;
      const TOP_RIGHT_IN = `calc(100% + -${revealThickness}px) ${revealThickness}px`;
      const BOTTOM_RIGHT_IN = `calc(100% + -${revealThickness}px) calc(100% + -${revealThickness}px)`;
      const BOTTOM_LEFT_IN = `${revealThickness}px calc(100% + -${revealThickness}px)`;
      const BOTTOM_RIGHT_OUT = `calc(100% + ${(revealThickness * 2)}px) 100%`;
      const TOP_RIGHT_OUT = `calc(100% + ${(revealThickness * 2)}px) 0px`;
      const BOTTOM_OUT = `${revealThickness}px calc(100% + ${(revealThickness)}px)`;

      this.renderer.setStyle(
        borderElement,
        'clip-path',
        `polygon(
      ${TOP_LEFT_OUT},
      ${BOTTOM_LEFT_OUT},
      ${BOTTOM_OUT},
      ${TOP_LEFT_IN},
      ${TOP_RIGHT_IN},
      ${BOTTOM_RIGHT_IN},
      ${BOTTOM_LEFT_IN},
      ${BOTTOM_OUT},
      ${BOTTOM_RIGHT_OUT},
      ${TOP_RIGHT_OUT})`
      );
    }
  }

  browserSupportsClipPathPolygon(): boolean {
    return (window as any).CSS && CSS.supports && CSS.supports('clip-path', 'polygon(0 0)');
  }

  appendBorderElementToHostElement(hostElement: any, borderElement: any) {
    this.renderer.appendChild(hostElement, borderElement);
  }

  setElementBackground(borderElement: any, backgroundStyleValue: string) {
    this.renderer.setStyle(borderElement, 'background', backgroundStyleValue);
  }

  optimizeCSSChanges(borderElement: any) {
    this.renderer.setStyle(borderElement, 'will-change', 'background');
  }
}
