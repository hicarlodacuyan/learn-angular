import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css'],
})
export class LinkComponent {
  @Input() link!: string;
  @Input() text!: string;
  @Input() icon!: string;
  @Input() active!: boolean;
  @Input() iconOnly: boolean = false;
}
