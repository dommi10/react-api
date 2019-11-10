/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('client', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    prenom: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    refUser: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tel: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ville: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    pays: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'client', 
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  });
};
