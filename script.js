document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById("display");
  const video = document.getElementById("specialVideo");
  const calculator = document.getElementById("calculatorContainer");
  let lyricsActive = false;

  const normalize = s => s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  window.appendValue = function(value) {
    if (lyricsActive) return;
    display.value = (display.value === '0') ? String(value) : (display.value || '') + String(value);
  };

  window.clearDisplay = function() {
    if (lyricsActive) return;
    display.value = '';
  };

  window.deleteLastChar = function() {
    if (lyricsActive) return;
    display.value = (display.value || '').slice(0, -1);
  };

  window.calculate = function() {
    if (lyricsActive) return;

    const expr = normalize(display.value || '').trim();
    if (!expr) return;

    
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      display.value = 'Error';
      return;
    }

    try {
      const result = Function('"use strict"; return (' + expr + ')')();
      display.value = String(result);

      
      if (Number(result) === 2 && video) {
        lyricsActive = true;
        calculator.style.display = 'none';
        video.style.display = 'block';
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => { video.controls = true; });
        }
        if (!video._listenerAdded) {
          video.addEventListener('ended', () => {
            video.style.display = 'none';
            video.controls = false;
            calculator.style.display = 'block';
            display.value = '';
            lyricsActive = false;
          });
          video._listenerAdded = true;
        }
      }
    } catch {
      display.value = 'Error';
    }
  };
});