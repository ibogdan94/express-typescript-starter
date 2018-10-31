import * as jwt from "jwt-simple";
import passport from "passport";
import Moment from 'moment'
import {Request, Response} from "express";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User, UserInstance } from "../models/user/user.model";
import * as bcrypt from 'bcrypt'
import {validationResult} from "express-validator/check";

class Auth {
    public initialize = () => {
        passport.use("jwt", this.getAuthStrategy());
        return passport.initialize();
    };

    public authenticate = (callback) => passport.authenticate("jwt", { session: false, failWithError: true }, callback);

    private getAuthStrategy = (): Strategy => {
        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true
        };

        return new Strategy(params, async (req: Request, payload: any, done) => {
            try {
                const user = await User.findOne({
                    where: {"email": payload.email}
                });

                if (user === null) {
                    return done(null, false, { message: "The user was not found" });
                }

                return done(null, { email: user.email });
            } catch (err) {
                return done(err);
            }
        });
    };

    public login = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json(errors.array());
            }

            const {email, password} = req.body;

            let user = await User.findOne({
                where: {"email": email}
            });

            if (user === null) {
                return res.status(401).json({message: `User with email ${email} was not found`});
            }

            user = user as UserInstance;

            if (!await this.comparePassword(password, user.password as string)) {
                return res.status(401).json({message: `Invalid password`});
            }

            res.status(200).json(this.generateToken(user));
        } catch (err) {
            res.status(401).json({message: "Invalid credentials"});
        }
    };

    private comparePassword = (candidatePassword: string, passwordHash: string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(candidatePassword, passwordHash, (err, success) => {
                return (err) ? reject(err) : resolve(success);
            });
        });
    };

    private generateToken = (user: UserInstance): Object => {
        let expires = Moment.utc().add({ days: 7 }).unix();

        let token = jwt.encode({
            exp: expires,
            email: user.email
        }, process.env.JWT_SECRET as string);

        return {
            token,
            expires: Moment.unix(expires).format(),
        };
    };

    public refreshToken = async (req: Request, res: Response) => {
        if (!req.body.token) {
            return res.status(400).json({message: `Token param was missed`});
        }

        try {
            const payload = jwt.decode(req.body.token, process.env.JWT_SECRET as string);
            if (!payload.email) {
                return res.status(400).json({message: `Invalid token`});
            }

            let user = await User.findOne({
                where: {"email": payload.email}
            });

            if (user === null) {
                return res.status(401).json({message: `User with email ${payload.email} was not found`});
            }

            res.status(200).json(this.generateToken(user));
        } catch (error) {
            return res.status(400).json({message: error.message});
        }
    }
}

export default new Auth();