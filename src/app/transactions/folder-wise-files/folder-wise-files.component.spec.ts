import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderWiseFilesComponent } from './folder-wise-files.component';

describe('FolderWiseFilesComponent', () => {
  let component: FolderWiseFilesComponent;
  let fixture: ComponentFixture<FolderWiseFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FolderWiseFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderWiseFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
