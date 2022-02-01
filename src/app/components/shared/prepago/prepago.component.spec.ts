import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrepagoComponent } from './prepago.component';

describe('PrepagoComponent', () => {
  let component: PrepagoComponent;
  let fixture: ComponentFixture<PrepagoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
