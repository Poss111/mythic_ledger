import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MythicLedgerComponent } from './mythic-ledger/mythic-ledger.component';
import { createCustomElement } from '@angular/elements';
import { Injector } from '@angular/core';
import { MythicLedgerService } from './mythic-ledger-service.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  template: '',
  providers: []
})
export class AppComponent {
}
