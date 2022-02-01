import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DialogoInfoComponent } from './dialogo-info.component';

describe('DialogoInfoComponent', () => {
  let component: DialogoInfoComponent;
  let fixture: ComponentFixture<DialogoInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
