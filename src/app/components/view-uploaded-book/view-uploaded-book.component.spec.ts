import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUploadedBookComponent } from './view-uploaded-book.component';

describe('ViewUploadedBookComponent', () => {
  let component: ViewUploadedBookComponent;
  let fixture: ComponentFixture<ViewUploadedBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUploadedBookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUploadedBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
