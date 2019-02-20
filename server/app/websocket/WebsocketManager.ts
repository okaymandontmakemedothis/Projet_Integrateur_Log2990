import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
// import { IChat } from "../../../common/communication/iChat";
import { IClickMessage } from "../../../common/communication/iGameplay";
import { User } from "../../../common/communication/iUser";
import { Constants } from "../constants";
// import { IPlayerInput, IPlayerInputReponse } from "../services/game/arena/interfaces";
import { GameManagerService } from "../services/game/game-manager.service";
import { UserManagerService } from "../services/user-manager.service";
import Types from "../types";

@injectable()
export class WebsocketManager {

    private io: SocketIO.Server;

    public constructor(
        @inject(Types.UserManagerService) private userManagerService: UserManagerService,
        @inject(Types.GameManagerService) private gameManagerService: GameManagerService) {}

    public createWebsocket(server: http.Server): void {
        this.io = SocketIO(server);
        this.io.on(Constants.CONNECTION, (socket: SocketIO.Socket) => {

            const user: User = {
                username: "",
                socketID: "",
            };
            const socketID: string = "";

            this.loginSocketChecker(user, socketID, socket);
            this.gameSocketChecker(socketID, socket, user);

         });
        this.io.listen(Constants.WEBSOCKET_PORT_NUMBER);

    }

                // a new message should be returned
            // const message: IChat = {
            //     username: "test",
            //     message: "x: " + data.positionX + " y: " + data.positionY + " ( ͡° ͜ʖ ͡°)",
            //     time: "1:30: 00 pm",
            // };

            // socket.emit(Constants.CHAT_MESSAGE, message);

    private gameSocketChecker(socketID: string, socket: SocketIO.Socket, user: User): void {

        socket.on(Constants.GAME_CONNECTION, () => {
            socketID = socket.id;
            this.gameManagerService.subscribeSocketID(socketID);
        });

        socket.on(Constants.GAME_DISCONNECT, () => {
            this.gameManagerService.unsubscribeSocketID(socketID);
        });

        socket.on(Constants.POSITION_VALIDATION_EVENT, (data: IClickMessage) => {
            console.log(user);

            // const user: User | string = this.userManagerService.getUserByUsername(data.username);

            // const playerInput: IPlayerInput = {
            //     event:      Constants.CLICK_EVENT,
            //     arenaId:    data.arenaID,
            //     user:       user.,
            //     position:   {
            //         x:  data.position.positionX,
            //         y:  data.position.positionY,
            //     },
            // }

            // this.gameManagerService.onPlayerInput(playerInput)
            // .then((response: IPlayerInputReponse) => {
            //     socket.emit(Constants.ON_ARENA_RESPONSE, response);
            // }).catch((error: Error) => {
            //     socket.emit(Constants.ON_ERROR_MESSAGE, error);
            // });
        });
    }

    private loginSocketChecker(user: User, socketID: string , socket: SocketIO.Socket): void {

        socket.on(Constants.LOGIN_EVENT, (data: string) => {
            user = {
                username: data,
                socketID: socket.id,
            };
            this.userManagerService.updateSocketID(user);
            socket.emit(Constants.USER_EVENT, user);
        });

        socket.on(Constants.DISCONNECT_EVENT, () => {
            this.userManagerService.leaveBrowser(user);
            this.gameManagerService.unsubscribeSocketID(socketID);
        });
    }

}
