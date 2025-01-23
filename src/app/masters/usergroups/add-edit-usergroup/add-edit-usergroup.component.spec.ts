import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUsergroupComponent } from './add-edit-usergroup.component';

describe('AddEditUsergroupComponent', () => {
  let component: AddEditUsergroupComponent;
  let fixture: ComponentFixture<AddEditUsergroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditUsergroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUsergroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
