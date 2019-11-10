/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paiement', {
    commande: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'commande',
        key: 'id'
      }
    },
    montant: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    datep: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    methode: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'paiement', 
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  });
};
