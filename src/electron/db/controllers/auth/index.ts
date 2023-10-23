import { controllers } from "../../../../common/api_controller";
import { signinToken } from "./signinToken";

export const authControllers = controllers("auth");
authControllers.add("signinToken", signinToken);
authControllers.add("signin", signinToken);
