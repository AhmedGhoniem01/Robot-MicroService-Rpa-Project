const event = require('./utils/eventEmitter');
const scheduler = require('./utils/scheduler');
const { GenerateSocketID } = require("./utils/generateSocketID")
const socketClients = new Map()
const fs = require('fs')
const Robot = require('./robot/robot');
const robotController = require('./robot/robotController');

async function ServerInit() {
    try {
        let result = await Robot.deleteAllRobots()
        socketClients.clear()
    } catch (err) {
        console.log(`\n[Server] => Internal Server Error\nServer Initialization Error\nError-Message: ${err.message}`)
    }
}

async function reScheduleJobs(robotAddress) {
    try {
        let scheduledJobs = await Robot.getRobotJobs(robotAddress);
        if (scheduledJobs) {
            scheduledJobs.map(async (job) => {
                let package = await Robot.getPackageById(job.packageID)
                let pkgMetaData = fs.readFileSync(`./packages/${package.name}`, { encoding: 'utf8' });
                console.log(`\n[Server] => Re-Scheduling the following package: ${package.packageName}`)
                // handle old dates
                scheduler.handlePkg(JSON.parse(pkgMetaData), job);
            })
        } else {
            console.log(`\n[Server] => No packages to re-schedule`)
        }
    } catch (err) {
        console.log(`\n[Server] => Internal Server Error\nError while re-scheduling packages\nError-Message: ${err.message}`)
    }
}

function socketListen(wss) {
    //1- Client connects to socketServer
    wss.on('connection', (socket) => {
        const socketID = GenerateSocketID()
        socketClients.set(socketID, socket)
        console.log('\n[Server] => New client robot connected: ', socketID);

        socket.on("message", async (message) => {
            const data = JSON.parse(message)
            switch (data.event) {
                //2- Client sends his Meta-Data and it's saved in db
                case "client robot metaData":
                    const metaData = data.value
                    console.log(`\n[Server] => Client robot meta-data Recieved\nClient: [${socketID}]\nRobot Meta-Data: ${metaData}`);
                    try {
                        await robotController.handleMetaData(metaData, socketID)
                        let { robotAddress } = JSON.parse(metaData)
                        //Reschedule any old jobs for this robot
                        reScheduleJobs(robotAddress)
                    } catch (err) {
                        console.log(`\n[Server] => Internal Server Error\nError while Sending Robot's Meta-Data\nError-Message: ${err.message}`)
                        socket.send('decline metadata reception')
                    }
                    break
                // 3- Client sending logs as JSON at execution runtime
                case "client robot message":
                    const logsJson = data.value
                    console.log(`\nOne Message Recieved\nClient: [${socketID}]\nMessage: [${logsJson}]`);
                    try {
                        await robotController.handleLogs(socketID, logsJson)
                    } catch (err) {
                        console.log(`\n[Server] => Internal Server Error\nError while Recieving Robot's Message\nError-Message: ${err.message}`)
                    }
                    break
                //resending failed received packages
                case "decline pkg reception":
                    const package_name = data.value
                    let pkgFilePath = `./packages/${package_name}`;
                    data = {
                        event: "notification",
                        value: pkgFilePath
                    }
                    event.send(JSON.stringify(data))
                    break
            }
        })
        // handling robots upon disconnection
        socket.on('close', async () => {
            console.log(`\n[Server] => Socket [${socketID}] disconnected`)
            try {
                await robotController.handleDisconnection(socketID)
                socketClients.delete(socketID);
            } catch (err) {
                console.log(`\n[Server] => Internal Server Error\nError while Updating Robot's Status upon disconnection\nError-Message: ${err.message}`)
            }
        })
        //scheduled notification at server for sending packages
        event.on('notification', async (pkgFilePath, task) => {
            console.log(`\n[Server] => Notification received at server\n`);
            try {
                let result = await robotController.handleSchedulerNotification(pkgFilePath)
                //If robot is connected then send the package to it
                if (result) {
                    data = {
                        event: "notification",
                        value: {
                            msg: "Initiating communication",
                            pkgMetaData: result
                        }
                    }
                    const socketClient = socketClients.get(socketID)
                    socketClient.send(JSON.stringify(data));
                    //Remove scheduled package from database
                    await Robot.removeScheduledJob(result.job)
                    //Stop task instance 
                    event.emit('JOB COMPLETED', task);
                }
            } catch (err) {
                console.log(`\n[Server] => Internal Server Error\nError while Sending scheduled package\nError-Message: ${err.message}`)
            }
        })
    });
}

module.exports = {
    socketListen,
    ServerInit
};
