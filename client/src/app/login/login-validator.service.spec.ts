import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { mock, verify, anyString, when } from "ts-mockito";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { Message } from "../../../../common/communication/message";
import "rxjs/add/operator/toPromise";
import { SocketService } from "../socket.service";
import { LoginValidatorService } from "./login-validator.service";
import { Constants } from "../constants";
import { Observable } from "rxjs";
import 'rxjs/add/observable/of';

let loginValidatorService: LoginValidatorService;
let router: Router;
let httpClient: HttpClient;
let socketService: SocketService;
let snackBar: MatSnackBar;

beforeEach(() => {
  router = mock(Router);
  httpClient = mock(HttpClient);
  socketService = mock(SocketService);
  snackBar = mock(MatSnackBar);

  loginValidatorService = new LoginValidatorService(router, snackBar, httpClient, socketService );
});

fdescribe("Tests on LoginValidatorService", () => {

  beforeEach(() => {

  TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      TestingImportsModule,
    ],
  });

  });

  it("should be invalid when form empty", () => {
    loginValidatorService.usernameFormControl.setValue("");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has less than 4 chars", () => {
    loginValidatorService.usernameFormControl.setValue("123");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be valid when form has between 4-15 chars (inclusive)", () => {
    loginValidatorService.usernameFormControl.setValue("12345678");
    expect(loginValidatorService.usernameFormControl.valid).toBeTruthy();
  });

  it("should be invalid when form has more than 15 chars", () => {
    loginValidatorService.usernameFormControl.setValue("1234567890123456");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has space characters", () => {
    loginValidatorService.usernameFormControl.setValue("test with space");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has special character", () => {
    loginValidatorService.usernameFormControl.setValue("test@");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has punctuation", () => {
    loginValidatorService.usernameFormControl.setValue("t.e.s.t");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should not call httpClient.post if socketService is undefined", () => {
    loginValidatorService = new LoginValidatorService(router, snackBar, httpClient, undefined);
    loginValidatorService.usernameFormControl.setValue("validName");
    loginValidatorService.addUsername();
    const message: Message = {
      title: Constants.LOGIN_MESSAGE_TITLE,
      body: loginValidatorService.usernameFormControl.value,
    };
    verify(httpClient.post(anyString(), message)).never();
  });

  it("should not call httpClient.post if usernameFormControl has error", () => {
    loginValidatorService = new LoginValidatorService(router, snackBar, httpClient, socketService);
    loginValidatorService.usernameFormControl.setValue("UnvalidName@...");
    loginValidatorService.addUsername();
    const message: Message = {
      title: Constants.LOGIN_MESSAGE_TITLE,
      body: loginValidatorService.usernameFormControl.value,
    };
    verify(httpClient.post(anyString(), message)).never();
  });

  it("should not call httpClient.post if usernameFormControl has error and socketService is undefined", () => {
    loginValidatorService = new LoginValidatorService(router, snackBar, httpClient, undefined);
    loginValidatorService.usernameFormControl.setValue("UnvalidName@...");
    loginValidatorService.addUsername();
    const message: Message = {
      title: Constants.LOGIN_MESSAGE_TITLE,
      body: loginValidatorService.usernameFormControl.value,
    };
    verify(httpClient.post(anyString(), message)).never();
  });

  it("should return a observable from post of httpClient", () => { 
    loginValidatorService.usernameFormControl.setValue("validName");

    loginValidatorService.addUsername();
    const message: Message = {
      title: Constants.LOGIN_MESSAGE_TITLE,
      body: loginValidatorService.usernameFormControl.value,
    };
    // verify(httpClient.post(anyString(), message)).never();
    // const returnedValue = Observable.of(true);
    // when(httpClient.post(anyString(), message)).thenReturn(Observable.of(false));
    // verify(router.navigate([Constants.ROUTER_LOGIN])).called();
  });

});
