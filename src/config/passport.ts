import * as passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class PassportConfiguration {
    constructor() {
        const strategy = new Strategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: "my_token"
            },
            (token, done) => {
                try {
                    return done(null, token.user);
                } catch (error) {
                    done(error);
                }
            }
        );
        passport.use(strategy);
    }
}
