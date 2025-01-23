import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAccountNumbersComponent } from './add-edit-account-numbers.component';

describe('AddEditAccountNumbersComponent', () => {
  let component: AddEditAccountNumbersComponent;
  let fixture: ComponentFixture<AddEditAccountNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditAccountNumbersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAccountNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
