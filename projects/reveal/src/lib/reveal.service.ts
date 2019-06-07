import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RevealService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
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
      ${revealRadialColor} 10%,
      ${revealRadialColor} 50%,
      ${revealRadialColor} 75%,
      ${revealBorderColor})`;
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
    this.renderer.setStyle(borderElement, 'padding', `${revealThickness}px`);
    this.renderer.setStyle(borderElement, 'background-color', defaultBorderColor);
    this.renderer.setStyle(borderElement, 'position', 'absolute');
    this.renderer.setStyle(borderElement, 'top', `-${revealThickness}px`);
    this.renderer.setStyle(borderElement, 'left', `-${revealThickness}px`);
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
    this.renderer.setStyle(hostElement, 'margin', `${revealThickness + revealMargin}px`);
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
   *   ║                      ║      2 :  BOTTOM_LEFT_OUT
   *   ║   4╔════════════╗5   ║      3 :  BOTTOM_OUT
   *   ║    ║            ║    ║      4 :  TOP_LEFT_IN
   *   ║    ║            ║    ║      5 :  TOP_RIGHT_IN
   *   ║    ║            ║    ║      6 :  BOTTOM_RIGHT_IN
   *   ║    ║            ║    ║      7 :  BOTTOM_LEFT_IN
   *   ║   7╠════════════╝6   ║      8 :  BOTTOM_OUT
   *   ║    ║                 ║      9 :  BOTTOM_RIGHT_OUT
   *  2╚════╩═════════════════╝9    10 :  TOP_RIGHT_OUT
   *       3&8
   */
  clipBorderElementFrameShape(borderElement: any, revealThickness: number) {
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

  appendBorderElementToHostElement(hostElement: any, borderElement: any) {
    this.renderer.appendChild(hostElement, borderElement);
  }

  setElementBackground(borderElement: any, backgroundStyleValue: string) {
    this.renderer.setStyle(borderElement, 'background', backgroundStyleValue);
  }
}
