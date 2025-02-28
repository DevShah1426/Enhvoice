import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProviderComponent } from './add-edit-provider.component';

describe('AddEditProviderComponent', () => {
  let component: AddEditProviderComponent;
  let fixture: ComponentFixture<AddEditProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditProviderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
