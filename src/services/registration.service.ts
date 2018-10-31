import * as bcrypt from 'bcrypt'
import { User, UserInstance } from '../models/user/user.model'

export class RegistrationService {
    register({ email, password }: UserInstance) {
        return bcrypt.hash(password, process.env.SALT_ITERATION as string)
            .then(hash => {
                return User.create({ id: 0, email, password: hash });
            })
    }
}