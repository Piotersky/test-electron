const { app, autoUpdater } = require('electron');
const { version } = require('./package.json');

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

function updateApp() {
  autoUpdater.checkForUpdates();
}

function initAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  });
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
  });
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
  });
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    sendStatusToWindow(log_message);
  });
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded; will install now');
    autoUpdater.quitAndInstall();
  });

  autoUpdater.setFeedURL({
    provider: 'github',
    owner: '<github_username>',
    repo: '<github_repo>',
    private: false
  });
}

app.on('ready', function() {
  initAutoUpdater();
  updateApp();
});