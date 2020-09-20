const {ipcRenderer, shell} = require('electron');
const youtubedl = require('youtube-dl');
const button = document.querySelector('.download-button');
const youtubeURL = document.querySelector('.url-input');
const setPathbtn = document.querySelector('.setpath-button');
const panel = document.querySelector('.panel');
const fs = require('fs')
const path = require('path');

const downloadPath = localStorage.getItem('directory');

let error = false;

const notifyWhenDone = (name) => {
    let iconAddress = path.join(__dirname, '/../assets/icons/icon.png');
    let myNotification = new Notification('YouTube Downloader', {
        title: 'Done!',
        body: 'Your download is Done!',
        icon: iconAddress
      });
    myNotification.onclick = () => {
        shell.showItemInFolder(`${downloadPath}`);
    }
}

const setPath = () => {
    if(!downloadPath){
        ipcRenderer.send('asynchronous-message', 'async ping')
    }
};

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    const { canceled, filePaths } = arg;
    if(!canceled){
        localStorage.setItem('directory', filePaths[0]);
    }
 })

const download = () => {
    const link = youtubeURL.value;
    if (link === ''){
        error = true;
        return;
    }
    // return a path has not been set
    if(!downloadPath){
        return;
    }
    const video = youtubedl(link,['--format=best'],{ cwd: __dirname,  maxBuffer: Infinity })
    let fulltitle = '';
    let thumbnail = '';
    let description = '';
    // Will be called when the download starts.

    youtubedl.getInfo(link, function(err, info) {
        if (err) throw err
        fulltitle = info.title;
        thumbnail = info.thumbnail;
        description = info.description
        const display = `<div class="display">
                                <div>
                                    <div>
                                        <h3 class="header-text">${fulltitle}</h3>
                                    </div>
                                </div>
                                <div class="image-container">
                                        <img src=${thumbnail} class="thumb"/>
                                </div>
                                <div>
                                    <div class="description-container">
                                        <span class="description">${description}</span>
                                    </div>
                                </div>
                          <div>`;
        panel.innerHTML = display;
      });
      video.on('info', () => {
          video.pipe(fs.createWriteStream(`${downloadPath}/${fulltitle}.mp4`));
      })
    
    video.on('end', function() {
        notifyWhenDone(fulltitle)
    })
};

const initModule = () => {
    setPathbtn.addEventListener('click', setPath)
    button.addEventListener('click', download);
};

initModule();