import { Component, EventEmitter, Input, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @Input() placeholder!: string;
  @Output() search = new EventEmitter<string>();
  private searchSubject: Subject<string> = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.search.emit(value);
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input?.value || '';
    this.search.emit(value);
  }
}
