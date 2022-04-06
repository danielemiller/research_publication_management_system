const fs = require('fs');
const path = require('path');

const servDir = 'server';
const finalDir = 'appsscript';
const distDir = 'build';
const htmlFile = 'index.html';


const dir = fs.readdirSync(path.resolve(__dirname,finalDir));

dir.forEach(f => {
    fs.copyFileSync(path.resolve(__dirname,finalDir,f), path.resolve(__dirname,servDir,f))
})