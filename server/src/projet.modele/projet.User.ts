import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.ts';

class User extends Model {
    declare id: number;
    declare Username: string;
    declare id_carte: string | null;
    declare inside: boolean;
    declare password: string | null;
    declare isAdmin: boolean;
}

User.init({
    Username: { type: DataTypes.STRING, allowNull: false },
    id_carte:  { type: DataTypes.STRING, allowNull: true },
    inside:    { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    password:  { type: DataTypes.STRING, allowNull: true },
    isAdmin:   { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    modelName: 'User'
});

export default User;
//commit