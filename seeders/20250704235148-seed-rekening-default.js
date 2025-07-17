"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("rekenings", [
      {
        name_bank: "BCA",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "BRI",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "DANA",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "GOPAY",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "JAGO",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "Mandiri",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "OVO",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "Seabank",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "ShopeePay",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name_bank: "Uang Tunai",
        tipe: "default",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "rekenings",
      {
        tipe: "default",
      },
      {}
    );
  },
};
