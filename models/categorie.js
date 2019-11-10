/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('categorie', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    designation: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'categorie',
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    }
  });
};
