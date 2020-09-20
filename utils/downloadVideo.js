const {ipcRenderer, shell} = require('electron');
const youtubedl = require('youtube-dl');
const button = document.querySelector('.download-button');
const youtubeURL = document.querySelector('.url-input');
const setPathbtn = document.querySelector('.setpath-button');
const panel = document.querySelector('.panel');
const showPercent = document.querySelector('.info-path');
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
    ipcRenderer.send('asynchronous-message', 'async ping')
};

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    const { canceled, filePaths } = arg;
    if(!canceled){
        localStorage.setItem('directory', filePaths[0]);
    }
 })


 function toSupportedFormat(url) {
    if (url.includes("list=")) {
        var playlistId = url.substring(url.indexOf('list=') + 5);
        return "https://www.youtube.com/playlist?list=" + playlistId;
    }
    return url;
}

const playlist = (url) => {
    'use strict'
    const video = youtubedl(url);
    let fulltitle = '';
    let thumbnail = '';
    let description = '';

    video.on('error', function error(err) {
      console.log('error 2:', err)
    })
   
    let size = 0
    video.on('info', function(info) {
      size = info.size
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
      video.pipe(fs.createWriteStream(`${downloadPath}/${fulltitle}.mp4`))
    })
   
    let pos = 0
    video.on('data', function data(chunk) {
      pos += chunk.length
      // `size` should not be 0 here.
      if (size) {
        let percent = (pos / size * 100).toFixed(2)
        process.stdout.cursorTo(0)
        process.stdout.clearLine(1)
        process.stdout.write(percent + '%')
        showPercent.innerHTML = `${percent}%`
      }
    })
    video.on('end', function() {
        notifyWhenDone(fulltitle)
    })
    video.on('next', playlist);
}

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
    if(link.includes("youtube.com/playlist?")){
        console.log('here')
        playlist(link);
    }else{
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
    }
};

const initModule = () => {
    setPathbtn.addEventListener('click', setPath)
    button.addEventListener('click', download);
};

initModule();