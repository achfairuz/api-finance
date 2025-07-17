"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class rekening extends Model {
    static associate(models) {
      // Satu rekening memiliki banyak transaksi
      rekening.hasMany(models.Transaction, {
        foreignKey: "rekening_id",
        as: "transactions",
      });
    }
  }

  rekening.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name_bank: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      balance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.0,
      },
      tipe: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "personal",
      },
    },
    {
      sequelize,
      modelName: "rekening",
      tableName: "rekenings",
    }
  );

  return rekening;
};
