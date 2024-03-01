import { Component, ViewEncapsulation } from '@angular/core';
import { NewVersionCheckerService } from '../../services/new-version-checker.service';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-newversion-checker',
  standalone: true,
  imports: [DialogModule],
  templateUrl: './app.newversion.checker.component.html',
  styleUrl: './app.newversion.checker.component.less',
  encapsulation: ViewEncapsulation.None
})
export class AppNewversionCheckerComponent {
  constructor(
    public newVersionCheckerService: NewVersionCheckerService
  ) {}

  applyUpdate(): void {
    this.newVersionCheckerService.applyUpdate();
  }
}
