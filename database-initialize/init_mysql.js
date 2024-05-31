require('dotenv').config();
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

console.log('Starting database initalization...');

console.log('Setting up schema...');
connect().then(
    async (connection) => {
        await initialize(connection);
        return connection;
    }
)
.then(
    async (connection) => {
        console.log('Done');
        console.log('Tables after schema loaded:');
        await show_all_tables(connection);
        return connection;
    }
)
.then(
    async (connection) => {
        console.log('Loading Test Data...');
        await loadTestData(connection);
        console.log('Done');
        return connection;
    }
)
.then(
    async (connection) => {
        console.log('Preview of data (skill):');
        await preview_skill(connection);
        console.log('Done');
        return connection;
    }
)
.then(
    () => console.log('Initialization Completed.')
);

async function connect() {
    const connection = await mysql.createConnection({
        host     : 'mysql.studev.groept.be',
        port     : 3306,
        user     : 'a23www407',
        password : '62uyJpSl',
        database : 'a23www407'
      });

    return connection
}

async function initialize(connection) {

    await (connection.query(`DROP TABLE IF EXISTS a23www407.trainingData;`));
    await (connection.query(`DROP TABLE IF EXISTS a23www407.trainingSets;`));
    await (connection.query(`DROP TABLE IF EXISTS a23www407.UserInfo;`));
    await (connection.query(`DROP TABLE IF EXISTS a23www407.progress;`));
    await (connection.query(`DROP TABLE IF EXISTS a23www407.lesson;`));
    await (connection.query(`DROP TABLE IF EXISTS a23www407.skill;`));
    await (connection.query(`DROP TABLE IF EXISTS a23www407.User;`));
    await (connection.query(`DROP TABLE IF EXISTS a23www407._prisma_migrations;`));

    
    await (connection.query(`CREATE TABLE IF NOT EXISTS a23www407.User (
        id VARCHAR(191) NOT NULL,
        name VARCHAR(191) NULL DEFAULT NULL,
        username VARCHAR(191) UNIQUE  NULL DEFAULT NULL,
        email VARCHAR(191) UNIQUE NULL DEFAULT NULL,
        emailVerified DATETIME(3) NULL DEFAULT NULL,
        image VARCHAR(191) NULL DEFAULT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        password VARCHAR(72) NOT NULL,
        PRIMARY KEY (id));`));
      
    await (connection.query(`CREATE TABLE IF NOT EXISTS a23www407.skill (
        skillLevelID INT NOT NULL,
        skillname VARCHAR(45) UNIQUE NOT NULL,
        PRIMARY KEY (skillLevelID));`));
    
    await (connection.query(`CREATE TABLE IF NOT EXISTS a23www407.UserInfo (
        userInfoID INT AUTO_INCREMENT NOT NULL,
        userID VARCHAR(45) UNIQUE NOT NULL,
        firstname VARCHAR(45) NOT NULL,
        lastname VARCHAR(45) NOT NULL,
        skillLevelID INT NOT NULL,
        PRIMARY KEY (userInfoID),
        CONSTRAINT skill
            FOREIGN KEY (skillLevelID)
            REFERENCES skill (skillLevelID));`));
    
    
    await (connection.query(`CREATE TABLE IF NOT EXISTS a23www407.lesson (
        lessonID INT AUTO_INCREMENT NOT NULL,
        lessonTitle VARCHAR(150) NOT NULL,
        lessonTag VARCHAR(100) NOT NULL,
        lessonDescription TEXT NOT NULL,
        lessonImg VARCHAR(45) NOT NULL,
        lessonLength INT NOT NULL,
        lessonLink VARCHAR(45) NOT NULL,
        isLocked SMALLINT NOT NULL DEFAULT '1',
        PRIMARY KEY (lessonID));`));
    
    
    await (connection.query(`CREATE TABLE IF NOT EXISTS a23www407.progress (
        progressID INT AUTO_INCREMENT NOT NULL,
        userID VARCHAR(191) NOT NULL,
        lessonID INT NOT NULL,
        progress INT NOT NULL DEFAULT '0',
        PRIMARY KEY (progressID),
        CONSTRAINT lesson
            FOREIGN KEY (lessonID)
            REFERENCES lesson (lessonID),
        CONSTRAINT User
            FOREIGN KEY (userID)
            REFERENCES User (id));`));
    
    
    await (connection.query(`CREATE TABLE IF NOT EXISTS a23www407.trainingSets (
        trainingSetID INT AUTO_INCREMENT NOT NULL,
        setName VARCHAR(45) NOT NULL,
        inputWidth INT NOT NULL,
        outputWidth INT NOT NULL,
        PRIMARY KEY (trainingSetID));`));
    
    await (connection.query(`CREATE TABLE IF NOT EXISTS a23www407.trainingData (
        trainingDataID INT AUTO_INCREMENT NOT NULL,
        trainingSetID int NOT NULL,
        inputData TEXT NOT NULL,
        outputData TEXT NOT NULL,
        PRIMARY KEY (trainingDataID),
        CONSTRAINT id FOREIGN KEY (trainingSetID) REFERENCES trainingSets (trainingSetID)
        );`));
    
    
    await (connection.query(`CREATE TABLE IF NOT EXISTS a23www407._prisma_migrations (
        id VARCHAR(36) NOT NULL,
        checksum VARCHAR(64) NOT NULL,
        finished_at DATETIME(3) NULL DEFAULT NULL,
        migration_name VARCHAR(255) NOT NULL,
        logs TEXT NULL DEFAULT NULL,
        rolled_back_at DATETIME(3) NULL DEFAULT NULL,
        started_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        applied_steps_count INT NOT NULL DEFAULT '0',
        PRIMARY KEY (id));`));

}

const parseCSV = async (filepath) => {
    const csvfile = fs.readFileSync(path.resolve(filepath), 'utf-8');

    return new Promise((resolve) => {
        Papa.parse(csvfile, {
            header: true,
            complete: (results) => {
                resolve(results.data);
            }
        });
    }); 
};

async function loadTestData(connection) {
    const src = process.env.CSVDATASOURCE;

    const skillData = await parseCSV(src+'lr-skill.csv');
    const skillLoad = skillData.map(skill => (connection.query(`INSERT INTO a23www407.skill (skillLevelID, skillname) VALUES (${skill['skillLevelID']}, '${skill['skillname']}');`)));
    await Promise.all(skillLoad);
    
    const lessonData = await parseCSV(src+'lr-lesson.csv');
    const lessonLoad = lessonData.map(lesson => (connection.query(`INSERT INTO a23www407.lesson (lessonID, lessonTitle, lessonTag, lessonDescription, lessonImg, lessonLength, lessonLink, isLocked)
        VALUES (${lesson['lessonID']}, '${lesson['lessonTitle']}','${lesson['lessonTag']}', "${lesson['lessonDescription']}", 
        '${lesson['lessonImg']}', ${lesson['lessonLength']}, '${lesson['lessonLink']}', ${lesson['isLocked']});`)));

    await Promise.all(lessonLoad);

    const userData = await parseCSV(src+'lr-user.csv');
    const userLoad = userData.map(user => (connection.query(`INSERT INTO a23www407.User (id, name, username, email, image, createdAt, updatedAt, password) 
        VALUES ('${user['id']}', '${user['name']}', '${user['username']}', '${user['email']}', ${user['image']},
     '${user['createdAt']}', '${user['updatedAt']}', '${user['password']}');`)));
    
    await Promise.all(userLoad);
    
    const uinfoData = await parseCSV(src+'lr-uinfo.csv');
    const uinfoLoad = uinfoData.map(uinfo => (connection.query(`INSERT INTO a23www407.UserInfo (userInfoID, userID, firstname, lastname, skillLevelID) 
        VALUES (${uinfo['userInfoID']}, '${uinfo['userID']}', '${uinfo['firstname']}', '${uinfo['lastname']}', ${uinfo['skillLevelID']});`)));
        
    await Promise.all(uinfoLoad);

    const tsetData = await parseCSV(src+'lr-trainingsets.csv');
    const tsetLoad = tsetData.map(tset => (connection.query(`INSERT INTO a23www407.trainingSets (trainingSetID, setName, inputWidth, outputWidth) 
        VALUES (${tset['trainingSetID']}, '${tset['setName']}', ${tset['inputWidth']}, ${tset['outputWidth']});`)));

    await Promise.all(tsetLoad);

    const tdataData = await parseCSV(src+'lr-trainingdata.csv');
    const tdataLoad = tdataData.map(tdata => (connection.query(`INSERT INTO a23www407.trainingData (trainingDataID, trainingSetID, inputData, outputData) 
        VALUES (${tdata['trainingDataID']}, ${tdata['trainingSetID']}, '${tdata['inputData']}', '${tdata['outputData']}');`)));

    await Promise.all(tdataLoad);
        
    const progressData = await parseCSV(src+'lr-progress.csv');
    const progressLoad = progressData.map(progress => (connection.query(`INSERT INTO a23www407.progress (progressID, userID, lessonID, progress) 
        VALUES (${progress['progressID']}, '${progress['userID']}', ${progress['lessonID']}, ${progress['progress']});`)));
        
    await Promise.all(progressLoad);

    
}

async function show_all_tables(connection) {
    const [results] = await connection.query(`SHOW TABLES`);
    console.log(results);
}

async function preview_skill(connection) {
    const [results] = await connection.query(`SELECT * FROM skill`);
    console.log(results);
}