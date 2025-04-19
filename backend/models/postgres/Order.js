const { DataTypes } = require('sequelize');
  const { getSequelizeInstance } = require('../../config/db');

  const sequelize = getSequelizeInstance(); // Get the initialized instance

  const Order = sequelize.define('Order', {
      // Model attributes are defined here
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          field: 'id',
      },
      customerName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'customername',
      },
      customerPhone: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'customerphone',
      },
      cartItems: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: [],
          field: 'cartitems',
      },
      totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          field: 'totalprice',
      },
      orderStatus: {
          type: DataTypes.STRING(255),
          allowNull: false,
          defaultValue: 'Received',
          field: 'orderstatus',
      },
      createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'createdat',
      },
      updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'updatedat',
      },
  }, {
      // Other model options go here
      tableName: 'orders',
      timestamps: true,
      underscored: false,
      indexes: [
          {
              fields: ['customerphone'],
          },
      ],
  });

  module.exports = Order;
