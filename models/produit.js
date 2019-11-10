/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('produit', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    designation: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    descriptions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    datea: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    rates: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: '0'
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: '0.00'
    },
    quantite: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    categorie: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'categorie',
        key: 'id'
      }
    }
  }, {
    tableName: 'produit', 
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  });
};
