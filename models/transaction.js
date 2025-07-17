"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // Relasi: satu transaksi milik satu rekening
      Transaction.belongsTo(models.rekening, {
        foreignKey: "rekening_id",
        as: "rekening",
      });
    }
  }

  Transaction.init(
    {
      rekening_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.0,
      },
      information: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("pengeluaran", "pemasukan"),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction", // nama model (untuk Sequelize)
      tableName: "Transactions", // nama tabel di database
    }
  );

  return Transaction;
};
