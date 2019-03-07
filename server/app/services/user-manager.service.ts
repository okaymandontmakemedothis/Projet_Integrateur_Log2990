import { injectable } from "inversify";
import { IUser } from "../../../common/communication/iUser";
import { Message } from "../../../common/communication/message";
import { CCommon } from "../../../common/constantes/cCommon";
import { Constants } from "../constants";

@injectable()
export class UserManagerService {

    private nameList: IUser[];

    public constructor() {
        this.nameList = [];
    }

    public get users(): IUser[] {
        return this.nameList;
    }

    public updateSocketID(newUserInfo: IUser): void {
        this.nameList.some((user: IUser): boolean => {
            if (user.socketID === newUserInfo.socketID) {
                user.username = newUserInfo.username;

                return true;
            } else if (user.username === newUserInfo.username) {
                user.socketID = newUserInfo.socketID;
            }

            return false;
        });

        this.nameList = this.nameList.filter((user: IUser) => {
            return user.socketID !== "undefined";
        });
    }

    public validateName(username: string): Message {

        const validationResult: Message = this.isUsernameFormatCorrect(username);
        if (validationResult.title !== CCommon.ON_SUCCESS) {
            return validationResult;
        }

        if (this.isUnique(username)) {
            const user: IUser = {
                username:   username,
                socketID:   "undefined",
            };
            this.nameList.push(user);

            return this.generateMessage(CCommon.ON_SUCCESS, CCommon.IS_UNIQUE);
        }

        return this.generateMessage(CCommon.ON_SUCCESS, Constants.NOT_UNIQUE_NAME);
    }

    public getUserByUsername(username: string): IUser | string {
        const foundUser: IUser =  this.users.filter((user: IUser) => {
            return user.username === username;
        })[0];

        return (foundUser) ? foundUser : Constants.USER_NOT_FOUND;
    }

    public leaveBrowser(user: IUser): void {
        this.nameList = this.nameList.filter( (element: IUser) => element.username !== user.username);
    }

    public isUnique(nameRequest: String): Boolean {
        let isUniqueElement: Boolean = true;
        this.nameList.forEach( (element: IUser) => {
            if (element.username === nameRequest) {
                isUniqueElement = false;
            }
        });

        return isUniqueElement;
    }

    private isUsernameFormatCorrect(username: string): Message {

        const regex: RegExp = new RegExp(CCommon.REGEX_PATTERN_ALPHANUM);

        if (username.length < CCommon.MIN_NAME_LENGTH || username.length > CCommon.MAX_NAME_LENGTH) {
            return this.generateMessage(CCommon.ON_ERROR, Constants.NAME_FORMAT_LENGTH_ERROR);
        }

        if (!regex.test(username)) {
            return this.generateMessage(CCommon.ON_ERROR, Constants.USER_NAME_ERROR);
        }

        return this.generateMessage(CCommon.ON_SUCCESS, CCommon.ON_SUCCESS);
    }

    private generateMessage(type: string, result: string): Message {
        return {
            title:  type,
            body:   result,
        } as Message;
    }
}
