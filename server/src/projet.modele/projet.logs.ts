import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.ts';

class Log extends Model {
    declare id: number;
    declare username: string;
    declare id_carte: string;
    declare action: 'entree' | 'sortie';
    declare timestamp: Date;
}

Log.init({
    username: { type: DataTypes.STRING, allowNull: false },
    id_carte: { type: DataTypes.STRING, allowNull: false },
    action:   { type: DataTypes.ENUM('entree', 'sortie'), allowNull: false },
    timestamp:{ type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
    sequelize,
    modelName: 'Log',
    timestamps: false,
});

export default Log;

//commit