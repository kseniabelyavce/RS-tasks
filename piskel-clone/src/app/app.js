/* eslint-disable linebreak-style */
import './style.css';
import Canvas from './tools/canvas';

require('./tools/color-picker.js');
require('./tools/frames.js');
require('./tools/deleteFrame.js');
require('./tools/setFramePrev.js');
require('./tools/addNewFrame.js');
require('./tools/cloneFrameTool.js');
require('./tools/selectFrameTool.js');
require('./tools/showCurrentFrame.js');
require('./tools/preview.js');
require('./tools/resizeTool.js');
require('./tools/resizeOfCanvas.js');
require('./tools/canvasData.js');
require('./tools/fullScreenTool.js');
require('./tools/checkCurrentTool.js');
require('./tools/shortcuts.js');
require('./tools/flip.js');
require('./tools/rotation.js');
require('./tools/invertColors.js');
require('./tools/drag&drop.js');

function startApp() {
  const canvas = new Canvas();
  canvas.init();
}


window.onload = startApp();
