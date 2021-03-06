#!/usr/bin/env node
process.env.RootDir = __dirname;
require('dotenv').config('/.env')
require('./dist/App.js');