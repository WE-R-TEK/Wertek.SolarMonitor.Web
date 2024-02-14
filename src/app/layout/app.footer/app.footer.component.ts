import { Component } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './app.footer.component.html',
  styleUrl: './app.footer.component.less'
})
export class AppFooterComponent {
  constructor(public layoutService: LayoutService) { }
}
