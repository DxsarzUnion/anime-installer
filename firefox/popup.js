document.addEventListener("DOMContentLoaded", async () => {
    const videoList = document.getElementById("video-list");
    const status = document.getElementById("status");
    const site_name = document.getElementById("site_name");
  
    // Получить активную вкладку
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  
    // Вставить скрипт в активную вкладку
    browser.tabs.executeScript(tab.id, {
      code: `
        Array.from(document.querySelectorAll('video source')).map(source => ({
          quality: source.getAttribute('label'),
          url: source.getAttribute('src')
        }));
      `
    }).then(results => {
      if (!results || results.length === 0 || results[0].length === 0) {
        status.textContent = "Видео не найдено";
        return;
      }
  
      const videos = results[0];
      site_name.textContent = "jut.su";
  

      videos.forEach(video => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = `Скачать ${video.quality}`;
        button.addEventListener("click", () => {
          browser.downloads.download({
            url: video.url,
            filename: `video_${video.quality}.mp4`
          });
        });
        li.appendChild(button);
        videoList.appendChild(li);
      });
    }).catch(err => {
      console.error(err);
      status.textContent = (window.location.hostname !== "jut.su") ? "Текущий сайт не является jut.su, в текущей версии другие не поддерживаются." : "Ошибка при извлечении видео.";
    });
  });
  