import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityHomeComponent } from './commodity-home.component';

describe('CommodityHomeComponent', () => {
  let component: CommodityHomeComponent;
  let fixture: ComponentFixture<CommodityHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommodityHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommodityHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
