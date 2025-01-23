import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedFoldersComponent } from './uploaded-folders.component';

describe('UploadedFoldersComponent', () => {
  let component: UploadedFoldersComponent;
  let fixture: ComponentFixture<UploadedFoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadedFoldersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
