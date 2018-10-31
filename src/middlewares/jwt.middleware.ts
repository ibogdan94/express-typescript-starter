import {Express} from 'express'
const auth = require("./../security/auth").default;

export default function (server: Express) {
    server.use(auth.initialize());

    server.use('/api', (req, res, next) => {
        return auth.authenticate((err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }

            server.set("user", user);

            return next();
        })(req, res, next);
    });
}