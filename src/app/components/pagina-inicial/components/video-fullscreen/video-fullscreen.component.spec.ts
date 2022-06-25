import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoFullscreenComponent } from './video-fullscreen.component';

describe('VideoFullscreenComponent', () => {
  let component: VideoFullscreenComponent;
  let fixture: ComponentFixture<VideoFullscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoFullscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
