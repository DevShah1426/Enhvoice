import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertywiseFilterComponent } from './propertywise-filter.component';

describe('PropertywiseFilterComponent', () => {
  let component: PropertywiseFilterComponent;
  let fixture: ComponentFixture<PropertywiseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertywiseFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertywiseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
