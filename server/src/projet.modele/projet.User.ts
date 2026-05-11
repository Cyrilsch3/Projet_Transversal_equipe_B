import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.ts';

class User extends Model {
    declare id: number;
    declare Username: string;
    declare id_carte: number;
    declare inside: boolean;
}
User.init({
    Username: { type: DataTypes.STRING, allowNull: false },
    id_carte: { type: DataTypes.NUMBER, allowNull: false },
    inside: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    modelName: 'User'
});

export default User;