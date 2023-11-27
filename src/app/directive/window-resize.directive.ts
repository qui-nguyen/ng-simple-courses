import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appWindowResize]'
})
export class WindowResizeDirective {
  @Output() windowResize: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkWindowSize();
  }

  constructor() {
    this.checkWindowSize(); // Calls the checkWindowSize method when the directive is initialized
  }

  private checkWindowSize(): void {
    const isLargeScreen = window.innerWidth > 821;
    this.windowResize.emit(isLargeScreen);
  }

}
