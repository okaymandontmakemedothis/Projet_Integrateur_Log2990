import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Constants } from "../../constants";
import { TestingImportsModule } from "../../testing-imports/testing-imports.module";
import { ChatViewComponent } from "../chat-view/chat-view.component";
import { MessageViewComponent } from "../chat-view/message-view/message-view.component";
import { GameViewFreeComponent } from "./game-view-free.component";
import { TheejsViewComponent } from "./threejs-view/threejs-view.component";

describe("GameViewFreeComponent", () => {

  let fixture: ComponentFixture<GameViewFreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GameViewFreeComponent,
        ChatViewComponent,
        MessageViewComponent,
        TheejsViewComponent,
      ],
      imports: [
        TestingImportsModule,
      ],
    })
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameViewFreeComponent);
    fixture.detectChanges();
  });
});
