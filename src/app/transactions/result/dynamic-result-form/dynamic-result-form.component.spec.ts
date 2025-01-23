import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicResultFormComponent } from './dynamic-result-form.component';

describe('DynamicResultFormComponent', () => {
  let component: DynamicResultFormComponent;
  let fixture: ComponentFixture<DynamicResultFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicResultFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicResultFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
