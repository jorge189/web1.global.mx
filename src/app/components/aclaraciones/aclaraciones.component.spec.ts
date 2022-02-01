import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AclaracionesComponent } from './aclaraciones.component';

describe('AclaracionesComponent', () => {
  let component: AclaracionesComponent;
  let fixture: ComponentFixture<AclaracionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AclaracionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AclaracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
