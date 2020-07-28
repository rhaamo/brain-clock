'use strict'

import { app, protocol, BrowserWindow, ipcMain, shell } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import ElectronStore from 'electron-store'
import moment from 'moment'

const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

const preferencesSchema = {
  locale: {
    type: 'string'
  }
}
const preferencesStore = new ElectronStore({
  preferencesSchema,
  name: 'settings'
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: isDevelopment ? 500 + 600 : 500,
    height: 800,
    title: 'BrainClock',
    resizable: false,
    backgroundColor: 'white',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

/* Database handling */
const databasePath = path.join(app.getPath('userData'), 'tasks.sqlite');
let knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: databasePath,
  },
  useNullAsDefault: true,
  migrations: {
    directory: isDevelopment ? 'src/migrations/' : path.join(process.resourcesPath, 'src/migrations')
  },
  debug: isDevelopment ? true : false
})

knex.migrate.latest().then(function () {
  console.log('database migrated.')
})
-/* tasks table */
knex.schema.hasTable('tasks').then(function (exists) {
  if (!exists) {
    return knex.schema.createTableIfNotExists('tasks', function (table) {
      table.increments('id')
      table.timestamp('started')
      table.timestamp('ended')
      table.integer('duration') // seconds
      table.text('title') // what the task was
    })    
  }
})
.then()

/* MAIN APP CODE */

let timerState = {
  ticking: false,
  start: null,
  end: null
}

ipcMain.on('toggleTimer', (e, taskText ) => {
  if (timerState.ticking === false) {
    timerState.ticking = true
    timerState.start = Date.now()
    console.log('DEBUG: timer started');
    win.webContents.send("timerStarted", timerState.start)
  } else {
    timerState.end = Date.now()
    insertTaskAndNotify(timerState.start, timerState.end, taskText);
    timerState.ticking = false
    console.log('DEBUG: timer stopped');
    win.webContents.send("timerStopped", timerState.start)
  }
})

ipcMain.on('addManualTask', (e, {startDate, duration, text}) => {
  let endDate = new Date(startDate.getTime()).setSeconds(startDate.getSeconds() + duration)
  insertTaskAndNotify(startDate, endDate, text)
})

function insertTaskAndNotify (start, end, text) {
  console.log("Task:", text, start, end);
  let duration = Math.floor((end - start) / 1000);
  knex.insert({ 
    started: start,
    duration: duration,
    title: text
   }).into('tasks').returning('id').then(function (result) {
     let id = result[0];
    win.webContents.send("taskAdded", {id: id, started: start, duration: duration, title: text });
   })
}

ipcMain.on('getPreference', (event, {key}) => {
  event.returnValue = preferencesStore.get(key);
})

ipcMain.on('setPreference', (event, {key, value}) => {
  event.returnValue = preferencesStore.set(key, value);
})

ipcMain.on('getAllTasks', (event) => {
  knex.select('id', 'started', 'duration', 'title').orderBy('started', 'desc').from('tasks').then(rows => event.returnValue = rows)
})

async function getTasksBetween (from, to) {
  return knex.select('id', 'started', 'duration', 'title').orderBy('started', 'desc').from('tasks').where('started', '>=', from).andWhere('started', '<=', to).then(rows => {return rows})
}

ipcMain.on('getTasksBetween', async (event, {from, to}) => {
  let results = await getTasksBetween(from, to)
  //event.returnValue = results
  let perDaysResults = {}

  // first create the arrays to receive days
  for (var i = 0; i < results.length; i++) {
    let day = moment(results[i].started).hours(0).minutes(0).seconds(0)
    if (day in perDaysResults) {
      perDaysResults[day].push(results[i])
    } else {
      perDaysResults[day] = [results[i]]
    }
  }

  // then populate the arrays
  console.log('PAGINATED RESULTS:', perDaysResults)
  event.returnValue = perDaysResults
})

ipcMain.on('deleteTask', (event, taskId) => {
  knex.where('id', taskId).from('tasks').delete().then(function (result) {
    // returns the number of rows impacted
    if (result === 1) {
      win.webContents.send("taskRemoved", {taskId})
    }
  })
})

ipcMain.on('openAboutLink', (_) => {
  shell.openExternal('https://dev.sigpipe.me/dashie/brainclock')
})

ipcMain.on('updateTask', (event, {taskId, start, end, duration, title}) => {
  knex('tasks').update({
    started: start,
    duration: duration,
    title: title
  }).where({id: taskId}).then(function (result) {
    event.returnValue = result === 1
  })
})