import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MythicLedgerComponent } from './mythic-ledger.component';

describe('MythicLedgerComponent', () => {
  let component: MythicLedgerComponent;
  let fixture: ComponentFixture<MythicLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MythicLedgerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MythicLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
