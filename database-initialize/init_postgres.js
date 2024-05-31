require('dotenv').config();
const { sql } = require('@vercel/postgres');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

console.log("Starting database initalization...");

console.log("Setting up schema...");

initialize()
.then(
    async (r) => {
        console.log("Done");
        console.log("Tables after schema loaded:");
        await show_all_tables();
    }
)
.then(
    async () => {
        console.log("Loading Test Data...");
        await loadTestData();
        console.log("Done");
    }
)
.then(
    async () => {
        console.log("Preview of data (skill):");
        await preview_skill();
        console.log("Done");
    }
)
.then(
    () => console.log("Initialization Completed.")
);

async function show_all_tables() {
    const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`;
    const data = res.rows.map(row => row.table_name);
    console.log(data);
}

async function preview_skill() {
    const res = await sql`SELECT * FROM "skill"`;
    console.log(res.rows);
}

async function initialize() {
    await (sql`DROP TABLE IF EXISTS "trainingData";`);
    await (sql`DROP TABLE IF EXISTS "trainingSets";`);
    await (sql`DROP TABLE IF EXISTS "UserInfo";`);
    await (sql`DROP TABLE IF EXISTS "progress";`);
    await (sql`DROP TABLE IF EXISTS "lesson";`);
    await (sql`DROP TABLE IF EXISTS "skill";`);
    await (sql`DROP TABLE IF EXISTS "User";`);
    
    await (sql`DROP TABLE IF EXISTS "_prisma_migrations";`);

    await (sql`CREATE TABLE IF NOT EXISTS "User" (
        "id" VARCHAR(191) NOT NULL,
        "name" VARCHAR(191) NULL DEFAULT NULL,
        "username" VARCHAR(191) UNIQUE  NULL DEFAULT NULL,
        "email" VARCHAR(191) UNIQUE NULL DEFAULT NULL,
        "emailVerified" timestamp(3) NULL DEFAULT NULL,
        "image" VARCHAR(191) NULL DEFAULT NULL,
        "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        "updatedAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        "password" VARCHAR(72) NOT NULL,
        PRIMARY KEY ("id"));`);
      
    await (sql`CREATE TABLE IF NOT EXISTS "skill" (
        "skillLevelID" INT NOT NULL,
        "skillname" VARCHAR(45) UNIQUE NOT NULL,
        PRIMARY KEY ("skillLevelID"));`);
    
    await (sql`CREATE TABLE IF NOT EXISTS "UserInfo" (
        "userInfoID" SERIAL NOT NULL,
        "userID" VARCHAR(45) UNIQUE NOT NULL,
        "firstname" VARCHAR(45) NOT NULL,
        "lastname" VARCHAR(45) NOT NULL,
        "skillLevelID" INT NOT NULL,
        PRIMARY KEY ("userInfoID"),
        CONSTRAINT "skill"
            FOREIGN KEY ("skillLevelID")
            REFERENCES "skill" ("skillLevelID"));`);
    
    
    await (sql`CREATE TABLE IF NOT EXISTS "lesson" (
        "lessonID" SERIAL NOT NULL,
        "lessonTitle" VARCHAR(150) NOT NULL,
        "lessonTag" VARCHAR(100) NOT NULL,
        "lessonDescription" TEXT NOT NULL,
        "lessonImg" VARCHAR(45) NOT NULL,
        "lessonLength" INT NOT NULL,
        "lessonLink" VARCHAR(45) NOT NULL,
        "isLocked" SMALLINT NOT NULL DEFAULT '1',
        PRIMARY KEY ("lessonID"));`);
    
    
    await (sql`CREATE TABLE IF NOT EXISTS "progress" (
        "progressID" SERIAL NOT NULL,
        "userID" VARCHAR(191) NOT NULL,
        "lessonID" INT NOT NULL,
        "progress" INT NOT NULL DEFAULT '0',
        PRIMARY KEY ("progressID"),
        CONSTRAINT "lesson"
            FOREIGN KEY ("lessonID")
            REFERENCES "lesson" ("lessonID"),
        CONSTRAINT "User"
            FOREIGN KEY ("userID")
            REFERENCES "User" ("id"));`);
    
    
    await (sql`CREATE TABLE IF NOT EXISTS "trainingSets" (
        "trainingSetID" SERIAL NOT NULL,
        "setName" VARCHAR(45) NOT NULL,
        "inputWidth" INT NOT NULL,
        "outputWidth" INT NOT NULL,
        PRIMARY KEY ("trainingSetID"));`);
    
    await (sql`CREATE TABLE IF NOT EXISTS "trainingData" (
        "trainingDataID" SERIAL NOT NULL,
        "trainingSetID" int NOT NULL,
        "inputData" TEXT NOT NULL,
        "outputData" TEXT NOT NULL,
        PRIMARY KEY ("trainingDataID"),
        CONSTRAINT "id" FOREIGN KEY ("trainingSetID") REFERENCES "trainingSets" ("trainingSetID")
        );`);
    
    
    await (sql`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id" VARCHAR(36) NOT NULL,
        "checksum" VARCHAR(64) NOT NULL,
        "finished_at" timestamp(3) NULL DEFAULT NULL,
        "migration_name" VARCHAR(255) NOT NULL,
        "logs" TEXT NULL DEFAULT NULL,
        "rolled_back_at" timestamp(3) NULL DEFAULT NULL,
        "started_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        "applied_steps_count" INT NOT NULL DEFAULT '0',
        PRIMARY KEY ("id"));`);

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

async function loadTestData() {
    const src = process.env.CSVDATASOURCE;

    const skillData = await parseCSV(src+'lr-skill.csv');
    for(skill of skillData) { 
        await (sql`INSERT INTO "skill" ("skillLevelID", "skillname") VALUES (${skill["skillLevelID"]}, ${skill["skillname"]});`); 
    }

    
    const lessonData = await parseCSV(src+'lr-lesson.csv');
    for(lesson of lessonData) { 
        await (sql`INSERT INTO "lesson" ("lessonID", "lessonTitle", "lessonTag", "lessonDescription", "lessonImg", "lessonLength", "lessonLink", "isLocked")
        VALUES (${lesson["lessonID"]}, ${lesson["lessonTitle"]}, ${lesson["lessonTag"]}, ${lesson["lessonDescription"]}, 
        ${lesson["lessonImg"]}, ${lesson["lessonLength"]}, ${lesson["lessonLink"]}, ${lesson["isLocked"]});`); 
    }

    const userData = await parseCSV(src+'lr-user.csv');
    for(user of userData) {
        await (sql`INSERT INTO "User" ("id", "name", "username", "email", "image", "createdAt", "updatedAt", "password") 
        VALUES (${user["id"]}, ${user["name"]}, ${user["username"]}, ${user["email"]}, ${user["image"]},
     ${new Date(user["createdAt"])}, ${new Date(user["updatedAt"])}, ${user["password"]});`); 
    }
    
    
    const uinfoData = await parseCSV(src+'lr-uinfo.csv');
    for(uinfo of uinfoData) {
        await (sql`INSERT INTO "UserInfo" ("userInfoID", "userID", "firstname", "lastname", "skillLevelID") 
        VALUES (${uinfo["userInfoID"]}, ${uinfo["userID"]}, ${uinfo["firstname"]}, ${uinfo["lastname"]}, ${uinfo["skillLevelID"]});`); 
    }
        

    const tsetData = await parseCSV(src+'lr-trainingsets.csv');
    for(tset of tsetData) { 
        await (sql`INSERT INTO "trainingSets" ("trainingSetID", "setName", "inputWidth", "outputWidth") 
        VALUES (${tset["trainingSetID"]}, ${tset["setName"]}, ${tset["inputWidth"]}, ${tset["outputWidth"]});`); 
    }


    const tdataData = await parseCSV(src+'lr-trainingdata.csv');
    for(tdata of tdataData) { 
        await (sql`INSERT INTO "trainingData" ("trainingDataID", "trainingSetID", "inputData", "outputData") 
        VALUES (${tdata["trainingDataID"]}, ${tdata["trainingSetID"]}, ${tdata["inputData"]}, ${tdata["outputData"]});`); 
    }

        
    const progressData = await parseCSV(src+'lr-progress.csv');
    for(progress of progressData) {
        await (sql`INSERT INTO "progress" ("progressID", "userID", "lessonID", "progress") 
        VALUES (${progress["progressID"]}, ${progress["userID"]}, ${progress["lessonID"]}, ${progress["progress"]});`)
    };

    
}