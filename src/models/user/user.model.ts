import * as Sequelize from 'sequelize'
import {sequelize} from './../sequelize';

export interface BuyerAddModel {
    email: string
    password: string
}

export interface UserAttributes {
    id: number
    email: string
    password?: string
    firstName?: string
    lastName?: string
    createdAt?: number
    updatedAt?: number
}

export type UserInstance = Sequelize.Instance<UserAttributes> & UserAttributes;

export const User = sequelize.define<UserInstance, UserAttributes>('users', {
    id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});


User.associate = (models) => {

};