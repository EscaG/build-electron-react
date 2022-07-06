const {app, BrowserWindow, Menu, ipcMain, Tray} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');


function createWindow () {

	let $width = 400;
	let $height = 600;
	let win = new BrowserWindow({
		title: 'Chat',
		height: 600,
		width: 400,
		// resizable: false,
		show: false,
		icon: __dirname + '../../public/icon.png',
		webPreferences: {
			// contextIsolation: false,
			// nodeIntegration: true,
			// worldSafeExecuteJavaScript: true,
			preload: path.join(app.getAppPath(), 'electron','preload', 'index.js')
		}
	})

	win.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../../build/index.html')}`
	)

	const tray = new Tray(path.resolve(__dirname, '../../public/icon.png'));
	tray.setToolTip("My App")
	tray.setContextMenu(Menu.buildFromTemplate([
		{
			label: 'Pulse',
			click: () => win.isVisible() ? win.hide() : win.show()
		},
		{role: 'quit'},
	]))
	tray.on('click', () => {
		win.isVisible() ? win.hide() : win.show()
	})

	// win.webContents.openDevTools({ mode: 'detach' })
	// win.webContents.openDevTools()

	win.on('ready-to-show', () => {
		console.log('ready to show');
		Menu.setApplicationMenu(Menu.buildFromTemplate([{ role: 'about' }]))
	})

	win.webContents.on('did-finish-load', function () {
		// Необходимо включать, если в настройках стоит show: false
		// Запускает окно, когда полностью всё приложение прогрузится, чтобы не было белого экрана
		console.log('did-finish-load');

		win.show();
	})

	win.webContents.on('context-menu', () => {
		const contextMenu = Menu.buildFromTemplate([
			{role: 'reload'},
			{role: 'toggleDevTools'},
		]);
		contextMenu.popup();	//? Подключение контекстного меню
	})

	win.on('close', () => {
		console.log('close');
	})
	win.on('closed', () => {
		console.log('closed');
		win = null;
	})

}

app.on('ready', () => {
	console.log('ready');
	createWindow(); // запуск приложения
	// app.showAboutPanel() // показать версию продукта, до релиза показывает только версию electronjs
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})


app.on('before-quit', () => {
	console.log('before quit')
})
app.on('will-quit', () => {
	console.log('will quit')
})
app.on('quit', () => {
	console.log('quit')
})




let onLine;
ipcMain.on('offline', () => {
	onLine = false;
	console.log('App is offline');
})
ipcMain.on('online', () => {
	onLine = true;
	console.log('App is online');
})
