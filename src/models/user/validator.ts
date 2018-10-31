import {check} from 'express-validator/check'

export const userRules = {
    forRegister: [
        check('email')
            .isEmail().withMessage('Invalid email format'),
        check('password')
            .isLength({min: 8}).withMessage('Invalid password. Min length is 8 symbols')
    ],
    forLogin: [
        check('email')
            .isEmail().withMessage('Invalid email format')
            .not().isEmpty(),
        check('password')
            .not().isEmpty().withMessage('Invalid email or password')
    ]
};