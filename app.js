'use strict';

//=======================================================================================

const qrcode = require('qrcode-terminal');
const {Client, LocalAuth} = require('whatsapp-web.js');
const fs = require('fs')

//=======================================================================================

function start(){
    let authStrategy = new LocalAuth({
        clientId: 'name'
    });

    var worker = `${authStrategy.dataPath}/session-random_str/Default/Service Worker`;

    if (fs.existsSync(worker)) {
        fs.rmSync(worker, { recursive: true });
    }

    const clientWha = new Client({
        authStrategy: authStrategy,
        puppeteer: {
            headless: true,
            args: ['--no-sandbox']
        },
        restartOnAuthFail: true,
        takeoverOnConflict: true,
        takeoverTimeoutMs: 10
    });

    clientWha.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });

    clientWha.on('ready', () => {
        console.log('Client is ready');
    });
     
    clientWha.on('auth_failure', msg => {
        console.log('Authentication failure', msg);
    });
    
    clientWha.on('authenticated', (session) => {
        console.log('Authenticated');
    });
    
    clientWha.on('message', async (msg) => {

        if (msg.body.indexOf('id') != -1){
            let chatId = msg['_data']['id']['remote'];
            clientWha.sendMessage(chatId, `id вашей руппы ${chatId}`);
        }
    });

    clientWha.initialize().catch(ex => {
        clientWha.destroy();
        start()
    });
}

start();