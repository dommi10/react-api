/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commande', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'client',
        key: 'id'
      }
    },
    produit: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    quantite: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1'
    },
    datec: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    etat: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '1',
      references: {
        model: 'etat',
        key: 'id'
      }
    }
  }, {
    tableName: 'commande', 
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  });
};
