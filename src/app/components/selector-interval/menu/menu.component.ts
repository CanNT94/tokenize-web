import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { selectorOptions } from '../../../constant/app-constant';
import { ChartOptionModel } from '../selector-interval.model';

@Component({
  selector: 'tokenize-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  @Input() displayedOptions: ChartOptionModel[] = selectorOptions;
  @Output() onSelect = new EventEmitter<string>();
  @Output() saveSelector = new EventEmitter<ChartOptionModel[]>();
  isEdit = false;
  selectorOptions: ChartOptionModel[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.selectorOptions = selectorOptions;
  }

  isOptionSelected(chartOptionModel: ChartOptionModel) {
    return this.displayedOptions.find(
      (displayedOption) => displayedOption.value === chartOptionModel.value
    );
  }

  changeMode(chartOptionModel: ChartOptionModel) {
    if (this.isEdit) {
      if (
        this.displayedOptions.find(
          (item) => item.value === chartOptionModel.value
        )
      ) {
        this.displayedOptions = this.displayedOptions.filter(
          ({ value }) => value !== chartOptionModel.value
        );
      } else {
        this.displayedOptions = this.selectorOptions.filter(
          (selectorOption) => {
            if (selectorOption.value === chartOptionModel.value) {
              return true;
            }
            return !!this.displayedOptions.find(
              (item) => item.value === selectorOption.value
            );
          }
        );
      }
    } else {
      this.onSelect.next(chartOptionModel.value);
    }
  }

  handleSave() {
    this.isEdit = false;
    this.saveSelector.emit(this.displayedOptions);
  }

  handleEdit() {
    this.isEdit = true;
    this.changeDetectorRef.markForCheck();
  }
}
