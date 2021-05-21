const {DataTypes} = require("sequelize");
const instance = require("../connection");

const note = instance.sequelize.define("notes",{
    id:{
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey:true,
        allowNull: false
      },
      uid:{
        type: DataTypes.STRING,
        allowNull:false
      },
      header:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
      },
      content:{
        type: DataTypes.STRING,
        allowNull:false,
      },
      date:{
        type: DataTypes.DATE,
        allowNull:false
      },
      time_start:{
        type: DataTypes.TIME,
        allowNull:false
      },
      time_end:{
        type: DataTypes.TIME,
        allowNull:false
      }
      
    },{
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        tableName:"notes"
    }
)



exports.model = note;