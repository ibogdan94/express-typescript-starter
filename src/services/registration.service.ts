import * as bcrypt from 'bcrypt'
import { User, UserInstance } from '../models/user/user.model'

export class RegistrationService {
    register({ email, password }: UserInstance) {
        let rounds : any = process.env.SALT_ITERATION;

        if (rounds === undefined || rounds === "") {
            rounds = 10;
        }

        return bcrypt.hash(password, parseInt(rounds))
            .then(hash => {
                return User.create({ email, password: hash });
            })
    }
}