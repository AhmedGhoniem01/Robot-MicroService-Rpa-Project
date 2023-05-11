const robotQueries = require('../db/queries').robotQueryList;
const dbConnection = require('../db/dbConnection');

//Robot model constructor
class Robot {
    static async getRobotBySocketID(socketID) {
        let queryText = robotQueries.GET_ROBOT_BY_SOCKET_ID;
        let values = [socketID];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result) 
                return result;
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async getRobotByAddress(robotAddress) {
        let queryText = robotQueries.GET_ROBOT_BY_ADDRESS;
        let values = [robotAddress];
        try {
            const [result] = await dbConnection.dbQuery(queryText, values);
            if (result) 
                return result;
            console.log("\nModel-Handling: Robot doesn't exist")
            return null;
        } catch (err) {
            console.log("Model-Handling-Error: Robot exists but Failed to get robot entity\n", err.message);
            return null;
        }
    }

    static async registerRobot(metaData, socketID) {
        let queryText = robotQueries.INSERT_ROBOT;
        let { robotName, robotAddress, userID } = metaData
        let updatedAt = new Date().toLocaleString()
        let values = [updatedAt, robotName, robotAddress, socketID, userID];
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to Register a new Robot entity\n", err.message);
            return null;
        }
    }

    static async updateStatus(robotJson, socketID) {
        try {
            let connected = !robotJson.connected;
            let updatedAt = new Date().toLocaleString();
            let robotAddress = robotJson.robotAddress
            
            let queryText = robotQueries.UPDATE_ROBOT_STATUS;
            let values = [updatedAt, connected, socketID, robotAddress];

            let result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log(`Model-Handling-Error: Failed to Access and Update robot entity status\n`, err.message)
            return null;
        }
    }

    static async deleteRobot(robotAddress) {
        let queryText = robotQueries.DELETE_ROBOT;
        let values = [robotAddress];
        try {
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        } catch (err) {
            console.log("Model-Handling-Error: Failed to delete robot entity\n", err.message);
            return null;
        }
    }

    static async getPreScheduledPackages()  {
        let queryText = robotQueries.GET_PRESCHEDULED_PACKAGES
        try{
            const result = await dbConnection.dbQuery(queryText);
            return result;
        }catch(err){
            console.log("Model-Handling-Error: Failed to return list of pre-scheduled packages from database\n", err.message);
            return null;
        }
    }

    static async saveScheduledPackage(packageName, scheduledDate)  {
        let queryText = robotQueries.SAVE_SCHEDULED_PACKAGE
        let values = [packageName, scheduledDate]
        try{
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        }catch(err){
            console.log("Model-Handling-Error: Failed to save scheduled package at database\n", err.message);
            return null;
        }
    }

    static async removeScheduledPackage(packageName)  {
        let queryText = robotQueries.REMOVE_SCHEDULED_PACKAGE
        let values = [packageName]
        try{
            const result = await dbConnection.dbQuery(queryText, values);
            return result;
        }catch(err){
            console.log("Model-Handling-Error: Failed to remove scheduled package from database\n", err.message);
            return null;
        }
    }
}

module.exports = Robot;