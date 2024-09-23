import { bootstrapApplication, createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { createCustomElement } from '@angular/elements';
import { MythicLedgerComponent } from './app/mythic-ledger/mythic-ledger.component';
import { MythicLedgerService } from './app/mythic-ledger-service.service';
createApplication()
.then((app) => {
    const MythicLedger = createCustomElement(MythicLedgerComponent, {
        injector: app.injector
    });
    customElements.define('mythic-ledger', MythicLedger);
})
.catch((err) => console.error(err));
