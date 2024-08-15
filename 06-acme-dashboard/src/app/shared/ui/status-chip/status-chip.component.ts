import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  templateUrl: './status-chip.component.html',
  styleUrls: ['./status-chip.component.css'],
})
export class StatusChipComponent {
  @Input() status: 'paid' | 'pending' = 'pending';

  getColor(): string {
    return this.status === 'paid' ? 'primary' : 'warn';
  }

  getIcon(): string {
    return this.status === 'paid' ? 'check' : 'schedule';
  }
}
