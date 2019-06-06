import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[fluentReveal]',
})
export class FluentRevealDirective implements OnInit {
  public thickness = 2;
  private defaultBorderColor = '#000';
  public defaultRadialColor = 0x000;
  public radialSize = 100;
  private borderElement;

  @HostListener('document:mousemove', ['$event'])
  onMouseMoved(ev) {
    this.drawCircle(ev.x, ev.y);
  }

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {
  }

  private drawCircle(x: number, y: number) {
    const elemY = this.hostElement.nativeElement.getBoundingClientRect().top;
    const elemX = this.hostElement.nativeElement.getBoundingClientRect().left;

    const radialX = 0 - elemX + x;
    const radialY = 0 - elemY + y;
    const gradientValue = `radial-gradient(
      circle ${this.radialSize}px at ${radialX}px ${radialY}px,
      rgb(255,0,0) 10%,
      rgb(0,255,0) 50%,
      rgb(0,0,255) 75%,
      ${this.defaultBorderColor})`;

    this.renderer.setStyle(
      this.borderElement,
      'background',
      gradientValue
    );
  }

  private createRevealWrapper() {
    // Creating border element
    this.borderElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.borderElement, 'width', '100%');
    this.renderer.setStyle(this.borderElement, 'height', '100%');
    this.renderer.setStyle(this.borderElement, 'padding', `${this.thickness}px`);
    this.renderer.setStyle(this.borderElement, 'background-color', 'green');
    this.renderer.setStyle(this.borderElement, 'position', 'absolute');
    this.renderer.setStyle(this.borderElement, 'top', `-${this.thickness}px`);
    this.renderer.setStyle(this.borderElement, 'left', `-${this.thickness}px`);
    this.renderer.setStyle(this.borderElement, 'z-index', '-1');

    // Appending border
    const element = this.hostElement.nativeElement;
    this.renderer.setStyle(element, 'position', 'relative');
    this.renderer.setStyle(element, 'margin', `${this.thickness}px`);

    // Border Clipping
    const width: number = this.hostElement.nativeElement.getBoundingClientRect().width;
    const height: number = this.hostElement.nativeElement.getBoundingClientRect().height;

    // TODO Use calc() instead!!!
    const topLeft = `${this.thickness}px ${this.thickness}px`;
    const topRight = `${Math.floor(width) + this.thickness}px ${this.thickness}px`;     // 75% 25%
    const bottomRight = `${Math.floor(width) + this.thickness}px ${Math.floor(height) + this.thickness}px`;  // 75% 75%
    const bottomLeft = `${this.thickness}px ${Math.floor(height) + this.thickness}px`;   // 25% 75%
    const endStitch = `${this.thickness}px ${Math.ceil(height) + (this.thickness * 2)}px`;   // 25% 100%

    this.renderer.setStyle(
      this.borderElement,
      'clip-path',
      `polygon(
      0px 0px,
      0px ${Math.ceil(height) + (this.thickness * 2)}px,
      ${endStitch},
      ${topLeft},
      ${topRight},
      ${bottomRight},
      ${bottomLeft},
      ${endStitch},
      ${Math.ceil(width) + (this.thickness * 2)}px ${Math.ceil(height) + (this.thickness * 2)}px,
      ${Math.ceil(width) + (this.thickness * 2)}px 0px
      )`
    );
    this.renderer.appendChild(this.hostElement.nativeElement, this.borderElement);

  }

  ngOnInit() {
    this.createRevealWrapper();
  }
}
