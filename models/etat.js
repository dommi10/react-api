/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('etat', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    designation: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    tableName: 'etat', 
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  });
};
