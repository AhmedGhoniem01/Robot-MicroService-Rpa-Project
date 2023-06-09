exports.RobotQueryList = {
    GET_ALL_ROBOTS: 'SELECT * FROM "Robot"',
    GET_ROBOT_BY_SOCKET_ID: 'SELECT * FROM "Robot" WHERE "socketID"=$1',
    GET_ROBOT_BY_NAME: 'SELECT * FROM "Robot" WHERE "robotName"=$1',
    GET_ROBOT_BY_ID: 'SELECT * FROM "Robot" WHERE "id"=$1',
    GET_ROBOT_BY_ADDRESS: 'SELECT * FROM "Robot" WHERE "robotAddress"=$1',
    INSERT_ROBOT: 'INSERT INTO "Robot" ("updatedAt", "robotName", "robotAddress", "socketID", "userID") VALUES ($1, $2, $3, $4, $5) RETURNING *',
    UPDATE_ROBOT_STATUS: 'UPDATE "Robot" SET "updatedAt"=$1, connected=$2, "socketID"=$3 WHERE "robotAddress"=$4',
    DELETE_ROBOT: 'DELETE FROM "Robot" WHERE "robotAddress"=$1',
    DELETE_ALL_ROBOTS: 'DELETE FROM "Robot" '
}

exports.PackageQueryList = {
    GET_PRESCHEDULED_PACKAGES: 'SELECT * FROM "ScheduledPackages" ',
    SAVE_SCHEDULED_PACKAGE: 'INSERT INTO "ScheduledPackages"("packageName", "scheduledDate", "scheduledTime") VALUES ($1, $2, $3)',
    REMOVE_SCHEDULED_PACKAGE: 'DELETE FROM "ScheduledPackages" WHERE "packageName"=$1',
    GET_PACKAGE_BY_NAME: 'SELECT * FROM "Package" WHERE "name"=$1',
    GET_PACKAGE_BY_ID: 'SELECT * FROM "Package" WHERE "id"=$1'
}

exports.JobQueryList = {
    REGISTER_JOB: 'INSERT INTO "Job" ("userID", "packageID", "robotID", "date", "time", "dateReceived", "status") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    GET_JOB_BY_ID: 'SELECT * FROM "Job" WHERE "id"=$1',
    GET_ALL_JOBS: 'SELECT * FROM "Job" ',
    GET_ROBOT_JOBS: 'SELECT * FROM "Job" where "robotID"=$1 ',
    REMOVE_SCHEDULED_JOB: 'DELETE FROM "Job" WHERE "id"=$1',
    UPDATE_SCHEDULED_JOB: 'UPDATE "Job" SET "status"=$1 WHERE "id"=$2',
}

exports.UserQueryList = {
    GET_USER_BY_UUID: 'SELECT * FROM "UserAccount" WHERE "uuid"=$1',
}





