import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RevealService {

  /**
   * Note: Coordinates must be given relative to the view port!
   * @param elementPosition The top left corner X or Y coordinate of the element to be revealed
   * @param mousePosition The X or Y coordinate of the mouse event
   */
  public getRadialPosition(elementPosition, mousePosition): number {
    return 0 - elementPosition + mousePosition;
  }

  /**
   * TODO
   * @param revealRadialSize number represents pixels
   * @param radialX X coordinate of the center point of the radial
   * @param radialY Y coordinate of the center point of the radial
   * @param revealRadialColor Must be a color acceptable by CSS standards
   * @param revealBorderColor Must be a color acceptable by CSS standards
   */
  public getRadialStyleValue(revealRadialSize: number,
                             radialX: number,
                             radialY: number,
                             revealRadialColor: string,
                             revealBorderColor: string): string {
    return `radial-gradient(
      circle ${revealRadialSize}px at ${radialX}px ${radialY}px,
      ${revealRadialColor} 10%,
      ${revealRadialColor} 50%,
      ${revealRadialColor} 75%,
      ${revealBorderColor})`;
  }

  constructor() {
  }
}
