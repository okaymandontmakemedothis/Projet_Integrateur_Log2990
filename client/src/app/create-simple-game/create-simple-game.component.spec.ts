import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { CreateSimpleGameComponent } from "./create-simple-game.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("CreateSimpleGameComponent", () => {
  let component: CreateSimpleGameComponent;
  let fixture: ComponentFixture<CreateSimpleGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSimpleGameComponent ],
      imports: [TestingImportsModule],
      providers: [{
        provide: MatDialogRef,
        useValue: {},
      },
                  {
        provide: MAT_DIALOG_DATA,
        useValue: {}, // Add any data you wish to test if it is passed/used correctly
      }],
    })
    .compileComponents()
    .catch(() => OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSimpleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});