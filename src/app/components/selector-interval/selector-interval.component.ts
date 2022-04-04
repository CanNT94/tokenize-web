import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { selectorOptions } from '../../constant/app-constant';
import { filter, Subject, takeUntil } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { ChartOptionModel } from './selector-interval.model';

@Component({
  selector: 'tokenize-selector-interval',
  templateUrl: './selector-interval.component.html',
  styleUrls: ['./selector-interval.component.scss'],
})
export class SelectorIntervalComponent implements OnInit, OnDestroy {
  @ViewChild('button', { static: true }) button!: ElementRef;
  @ViewChild('menu', { static: true }) menu!: TemplateRef<unknown>;
  @Output() onSelect = new EventEmitter<string>();
  showPopup = false;
  destroy$ = new Subject<void>();
  displayedSelectors = selectorOptions;
  overlayRef!: OverlayRef;
  selectedItem: string = selectorOptions[0].value;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.button)
        .withPositions([
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
          },
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
          },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
    this.overlayRef
      .outsidePointerEvents()
      .pipe(
        filter((event) => !this.button.nativeElement.contains(event.target)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closePopup();
      });
  }

  selectSelector(item: ChartOptionModel) {
    this.selectedItem = item.value;
    this.onSelect.emit(item.value);
  }

  onChooseOption(value: string) {
    this.selectedItem = value;
    this.onSelect.emit(value);
    this.closePopup();
  }

  displayIcon() {
    return !this.displayedSelectors.find(
      ({ value }) => value === this.selectedItem
    );
  }

  handlePopup() {
    if (!this.showPopup) {
      this.openPopup();
    } else {
      this.closePopup();
    }
  }

  handleSave(options: ChartOptionModel[]) {
    this.displayedSelectors = [...options];
    this.closePopup();
    this.changeDetectorRef.markForCheck();
  }

  private openPopup() {
    this.showPopup = true;
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(
        new TemplatePortal(this.menu, this.viewContainerRef)
      );
    }
    this.changeDetectorRef.markForCheck();
  }

  private closePopup() {
    this.showPopup = false;
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this.destroy$.complete();
    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
    this.overlayRef.dispose();
  }
}
