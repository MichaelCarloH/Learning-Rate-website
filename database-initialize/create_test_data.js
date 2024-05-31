require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const dir = './csv.generated/';
const baseline = './csv.baseline/';

function clear_files() {
    fs.readdirSync(path.resolve(dir)).forEach(file => fs.unlinkSync(path.resolve(dir+file)) );
    fs.readdirSync(path.resolve(baseline)).forEach(file => fs.copyFileSync(path.resolve(baseline+file), path.resolve(dir+file)) );
}

async function writeToCSV(items, filepath) {
    const header = Object.keys(items[0]);
    const csv = [
    ...items.map(row => header.map(fieldName => {
        const json = JSON.stringify(row[fieldName]);
        return (json != "\"\""? json : 'NULL');
    }).join(','))
    ].join('\r\n');

    fs.writeFileSync(path.resolve(filepath), '\r\n'+csv, { flag: 'a' });
};

async function parseCSV(filepath) {
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

async function generateUserCSVs() {
    const mockdata = await parseCSV('./mockdata/lr-mock.csv');

    const users = mockdata.map(user => 
        { return {
            id: user['id'],
            name: user['name'],
            username: user['username'],
            email: user['email'],
            emailVerified: user['emailVerified'],
            image: user['image'],
            createdAt: user['createdAt'],
            updatedAt: user['updatedAt'],
            password: user['password']
        }
    });
         
    await writeToCSV(users, dir+'lr-user.csv');

    const uinfos = mockdata.map((user, i) => 
        { return {
            userInfoID: i+15,
            userID: user['id'],
            firstname: user['firstname'],
            lastname: user['lastname'],
            skillLevelID: parseInt(user['skillLevelID']),
        }
    });
         
    await writeToCSV(uinfos, dir+'lr-uinfo.csv');

    const progs = mockdata.map((user, i) => 
        { return {
            progressID: i+67,
            userID: user['id'],
            lessonID: 1,
            progress: Math.floor(Math.random() * 25),
        }
    });
         
    await writeToCSV(progs, dir+'lr-progress.csv');

}


async function generateTDataCSVs() {

    const y2x1 = [];
    let i;
    for(i = 0; i < 100; i++) {
        y2x1.push({
            trainingDataID: i+10,
            trainingSetID: 1,
            inputData: `[${i}]`,
            outputData: `[${ (2*i) + 1}]`,
        });
    }
         
    await writeToCSV(y2x1, dir+'lr-trainingData.csv');

    const xor = [
        {
            trainingDataID: ++i+10,
            trainingSetID: 2,
            inputData:  '[0,0]',
            outputData: '[0]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 2,
            inputData:  '[0,1]',
            outputData: '[1]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 2,
            inputData:  '[1,0]',
            outputData: '[1]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 2,
            inputData:  '[1,1]',
            outputData: '[0]'
        },
    ];
        
    await writeToCSV(xor, dir+'lr-trainingData.csv');


    const and3 = [
        {
            trainingDataID: ++i+10,
            trainingSetID: 3,
            inputData:  '[0,0,0]',
            outputData: '[0]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 3,
            inputData:  '[0,0,1]',
            outputData: '[0]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 3,
            inputData:  '[0,1,0]',
            outputData: '[0]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 3,
            inputData:  '[0,1,1]',
            outputData: '[0]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 3,
            inputData:  '[1,0,0]',
            outputData: '[0]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 3,
            inputData:  '[1,0,1]',
            outputData: '[0]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 3,
            inputData:  '[1,1,0]',
            outputData: '[0]'
        },
        {
            trainingDataID: ++i+10,
            trainingSetID: 3,
            inputData:  '[1,1,1]',
            outputData: '[1]'
        },
        
    ];
        
    await writeToCSV(and3, dir+'lr-trainingData.csv');
}

clear_files();
generateUserCSVs().then(
    () => generateTDataCSVs()
);

