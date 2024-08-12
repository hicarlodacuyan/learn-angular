import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent {
  @Input() length!: number;
  @Input() pageSize: number = 5;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.page.emit(event);
  }
}
