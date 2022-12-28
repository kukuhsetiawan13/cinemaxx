'use strict';
const {generateHashedPassword} = require('../helpers/bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let dataUsers = require('../data/data.json').Users
    dataUsers.forEach(el => {
      el.password = generateHashedPassword(el.password)
      el.createdAt = el.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Users', dataUsers)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users')
  }
};
