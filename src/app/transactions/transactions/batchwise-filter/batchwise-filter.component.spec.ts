import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchwiseFilterComponent } from './batchwise-filter.component';

describe('BatchwiseFilterComponent', () => {
  let component: BatchwiseFilterComponent;
  let fixture: ComponentFixture<BatchwiseFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchwiseFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchwiseFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
