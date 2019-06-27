import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * Used the Angular Material checkbox component as reference to
 * how to implement a custom FormInput component
 * https://github.com/angular/components/blob/master/src/material/checkbox/checkbox.ts
 * https://rangle.io/blog/angular-2-ngmodel-and-custom-form-components/
 */

let countSequence = 0;

/** Change event object emitted by FluentCheckBox. */
export class FluentCheckBoxChange {
  /** The source MatCheckbox of the event. */
  source: FluentCheckBox;
  /** The new `checked` value of the checkbox. */
  checked: boolean;
}

@Component({
  selector: 'fluent-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: FluentCheckBox, multi: true}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FluentCheckBox implements OnInit, ControlValueAccessor {
  private isChecked = false;
  private isIndeterminate: boolean = false;
  private UNIQUE_ID = `fluent-check-box-${++countSequence}`;


  @Input() disabled: boolean;
  @Input() value: string;
  @Input() name: string | null = null;
  @Input() labelBefore = false;
  @Input() required: boolean;
  @Input() id: string = this.UNIQUE_ID;
  @Input('aria-labelledby') ariaLabelledby: string | null = null;
  @Input('aria-label') ariaLabel = '';

  @Input()
  get checked(): boolean { return this.isChecked; }

  set checked(value: boolean) {
    if (value !== this.checked) {
      this.isChecked = value;
      this.changeDetector.markForCheck();
    }
  }

  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  @Input()
  get indeterminate(): boolean { return this.isIndeterminate; }

  set indeterminate(value: boolean) {
    if (value !== this.isIndeterminate) {
      this.isIndeterminate = value;
      this.indeterminateChange.emit(this.isIndeterminate);
    }
  }

  /** Event emitted when the checkbox's `checked` value changes. */
  @Output() readonly change: EventEmitter<FluentCheckBoxChange> = new EventEmitter<FluentCheckBoxChange>();
  @Output() readonly indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  /**
   * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
   */
  private onTouched: () => any = () => {};

  private controlValueAccessorChangeFn: (value: any) => void = () => {};

  /**
   * We always have to stop propagation on the change event.
   * Otherwise the change event, from the input element, will bubble up and
   * emit its event object to the `change` output.
   */
  onInteractionEvent(event: MouseEvent) {
    event.stopPropagation();
  }

  /**
   * We have to stop propagation for click events on the visual hidden input element.
   * By default, when a user clicks on a label element, a generated click event will be
   * dispatched on the associated input element. Since we are using a label element as our
   * root container, the click event on the `checkbox` will be executed twice.
   * The real click event will bubble up, and the generated click event also tries to bubble up.
   * This will lead to multiple click events.
   * Preventing bubbling for the second event will solve that issue.
   */
  onInputClick(event: MouseEvent) {
    event.stopPropagation();

    if (!this.disabled) {
      // When user manually click on the checkbox, `indeterminate` is set to false.
      if (this.indeterminate) {
        Promise.resolve().then(() => {
          this.indeterminate = false;
        });
      }
      this.checked = !this.checked;
      this.emitChangeEvent();
    }
  }

  private emitChangeEvent() {
    const event = new FluentCheckBoxChange();
    event.source = this;
    event.checked = this.checked;

    this.controlValueAccessorChangeFn(this.checked);
    this.change.emit(event);
  }

  ngOnInit() {}

  /**
   * ControlValueAccessor
   */
  registerOnChange(fn: (value: any) => void) {
    this.controlValueAccessorChangeFn = fn;
  }

  /**
   * ControlValueAccessor
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * ControlValueAccessor
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /**
   * ControlValueAccessor
   */
  writeValue(checked: boolean): void {
    this.checked = !!(checked);
  }

  getAriaChecked(): 'true' | 'false' | 'mixed' {
    return this.checked ? 'true' : (this.indeterminate ? 'mixed' : 'false');
  }
}
