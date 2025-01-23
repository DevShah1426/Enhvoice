import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUtilityComponent } from './add-edit-utility.component';

describe('AddEditUtilityComponent', () => {
  let component: AddEditUtilityComponent;
  let fixture: ComponentFixture<AddEditUtilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditUtilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
