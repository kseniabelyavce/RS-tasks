window.addEventListener('load', function() {
  const canvas = document.getElementById('canvas');
  canvas.addEventListener('click', simplePen);

  const paintBucket = document.getElementById('paint-bucket');
  const chooseColor = document.getElementById('choose-color');
  const pencil = document.getElementById('pencil');
  const loadBtn = document.getElementById('form__btn');

  loadBtn.addEventListener(
    'click',
    async e => {
      e.preventDefault();
      paint();
    },
    false
  );

  paintBucket.addEventListener('input', function() {
    canvas.removeEventListener('mousedown', simplePen);
  });

  chooseColor.addEventListener('input', function() {
    canvas.removeEventListener('mousedown', simplePen);
    canvas.addEventListener('mousedown', pickColor);
  });

  pencil.addEventListener('input', function() {
    canvas.addEventListener('mousedown', simplePen);
  });
});

function drawPixel(rgba, x, y, ctx) {
  const imgData = ctx.createImageData(1, 1);

  let i = 0;
  for (; i < 4; i++) {
    imgData.data[i] = rgba[i];
  }

  ctx.putImageData(imgData, x, y);
}

// function fillColor(e) {
//   const canvas = document.getElementById('canvas');
//   const ctx = canvas.getContext('2d');

//   // TODO
//   // const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
//   // imageData.data = '';
// }

function getCanvasSize() {
  return parseInt(document.getElementById('canvas').getAttribute('width'));
}

function hexToRGBA(hex) {
  hex = hex.replace('#', '');

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4), 16);

  return [r, g, b, 255];
}

function pickColor(e) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const x = Math.floor((e.offsetX * getCanvasSize()) / canvas.offsetWidth);
  const y = Math.floor((e.offsetY * getCanvasSize()) / canvas.offsetHeight);

  const [R, G, B] = ctx.getImageData(x, y, 1, 1).data;

  const hex = rgbToHex(R, G, B);
  const prevHex = document.getElementById('current-color').value;

  if (prevHex !== hex) {
    document.getElementById('prev-color').value = prevHex;
    document.getElementById('prev-color').setAttribute('value', prevHex);

    document.getElementById('current-color').value = hex;
    document.getElementById('current-color').setAttribute('value', hex);
  }
}

function valueToHex(c) {
  const hex = c.toString(16);
  return hex.padStart(2, '0');
}

function rgbToHex(r, g, b) {
  return `#${valueToHex(r)}${valueToHex(g)}${valueToHex(b)}`;
}

function simplePen(e) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  let x0 = Math.floor((e.offsetX * getCanvasSize()) / canvas.offsetWidth);
  let y0 = Math.floor((e.offsetY * getCanvasSize()) / canvas.offsetHeight);
  let x1;
  let y1;

  let rgbaColor;
  let isDrag = true;

  rgbaColor = hexToRGBA(document.getElementById('current-color').value, 255);

  drawPixel(rgbaColor, x0, y0, ctx);

  canvas.addEventListener('mousemove', mousemoveEvent);
  canvas.addEventListener('mouseup', mouseupEvent);
  canvas.addEventListener('mouseleave', mouseupEvent);

  function mousemoveEvent(event) {
    if (isDrag) {
      x1 = Math.floor((event.offsetX * getCanvasSize()) / canvas.offsetWidth);
      y1 = Math.floor((event.offsetY * getCanvasSize()) / canvas.offsetHeight);

      drawLine(x0, y0, x1, y1, rgbaColor, ctx);

      x0 = x1;
      y0 = y1;
    }
  }

  function mouseupEvent() {
    isDrag = false;

    // TODO: удалять только после смены инструмента
    // canvas.removeEventListener('mousemove', mousemoveEvent);
    // canvas.removeEventListener('mouseup', mouseupEvent);
    // canvas.removeEventListener('mouseleave', mouseupEvent);
  }
}

function drawLine(x1, y1, x2, y2, color, ctx) {
  const deltaX = Math.abs(x2 - x1);
  const deltaY = Math.abs(y2 - y1);
  const signX = x1 < x2 ? 1 : -1;
  const signY = y1 < y2 ? 1 : -1;

  let error = deltaX - deltaY;

  drawPixel(color, x2, y2, ctx);

  while (x1 !== x2 || y1 !== y2) {
    drawPixel(color, x1, y1, ctx);
    const error2 = error * 2;

    if (error2 > -deltaY) {
      error -= deltaY;
      x1 += signX;
    }
    if (error2 < deltaX) {
      error += deltaX;
      y1 += signY;
    }
  }
}

async function paint() {
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  img.addEventListener(
    'load',
    function() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      const resolutionBtns = document.getElementsByName('resolution')

      clear(ctx);

      resolutionBtns.forEach(function(resolutionBtn) {
        resolutionBtn.addEventListener('change', function() {
         canvas.width = canvas.height = this.value;
        });
      });

      const imgWidth = this.width;
      const imgHeight = this.height;
      var imageAspectRatio = imgWidth / imgHeight;
      var canvasAspectRatio = canvas.width / canvas.height;
      var renderableHeight, renderableWidth, xStart, yStart;

      // If image's aspect ratio is less than canvas's we fit on height
      // and place the image centrally along width
      if (imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = imgWidth * (renderableHeight / imgHeight);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
      }

      // If image's aspect ratio is greater than canvas's we fit on width
      // and place the image centrally along height
      else if (imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvas.width;
        renderableHeight = imgHeight * (renderableWidth / imgWidth);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
      }

      // Happy path - keep aspect ratio
      else {
        renderableHeight = canvas.height;
        renderableWidth = canvas.width;
        xStart = 0;
        yStart = 0;
      }

      ctx.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);

      try {
        localStorage.setItem('saved-image', canvas.toDataURL('image/png'));
      } catch (err) {
        console.log('Error: ' + err);
      }
    },
    false
  );

  img.src = await getLinkToImage();
}

// client_id=664dc293f77e876e9a8a055cb23803f42c0e96eb80e61a5ffca4e5d28b3a9e69
// client_id=962689ddf2a131fe3a268d3927a66cabaa6f95b9cbf1b9526895d0cd057dc324
async function getLinkToImage() {
  const town = document.getElementById('form__text').value || 'Minsk';

  const apiUrl = `https://api.unsplash.com/photos/random?query=town,${town}&client_id=664dc293f77e876e9a8a055cb23803f42c0e96eb80e61a5ffca4e5d28b3a9e69`;

  const url = await fetch(apiUrl)
    .then(response => response.json())
    .then(json => json.urls.small);

  return url;
}

function clear(context) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}
