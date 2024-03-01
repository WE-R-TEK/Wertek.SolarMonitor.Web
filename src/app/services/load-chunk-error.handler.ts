import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { DialogService } from "primeng/dynamicdialog";
import { AppNewversionComponent } from "../layout/app.newversion/app.newversion.component";

@Injectable()
export class LoadChunkErrorHandler implements ErrorHandler {

  constructor(
    private readonly injector: Injector
  ) { }

  handleError(error: any): void {
    const chunkFailMessage = /Loading chunk [\d]+ failed/;
    if (chunkFailMessage.test(error.message)) {
      console.error(error);
      this.openNewVersionBanner();
    }
    console.error(error);
  }

  openNewVersionBanner() {
    const dialogService = this.injector.get(DialogService);
    const bannerDialog = dialogService.open(AppNewversionComponent,{
      header: 'Nova versão disponível',
      contentStyle: { 'text-align': 'center' },
      dismissableMask: false,
      style: { width: '20%' }
    });
    bannerDialog.onClose.subscribe(() => {
      window.location.reload();
    });
  }

}
