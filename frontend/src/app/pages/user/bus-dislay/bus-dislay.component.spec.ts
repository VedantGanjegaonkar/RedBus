import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDislayComponent } from './bus-dislay.component';

describe('BusDislayComponent', () => {
  let component: BusDislayComponent;
  let fixture: ComponentFixture<BusDislayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusDislayComponent]
    });
    fixture = TestBed.createComponent(BusDislayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
