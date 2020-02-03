/* eslint-disable array-callback-return */

import Pen from './pen';
import Bucket from './bucket';
import FillBucket from './fill-bucket';
import Eraser from './eraser';
import Rectangle from './rectangle';
import Circle from './circle';
import Move from './move';
import Crop from './crop';
import ColorPickerCanvas from './color-picker-canvas';
import CloneCanvasBackground from './cloneCanvasBackground';

let currentTool = 'pen';

export default class CheckCurrentTool {
  constructor() {
    this.canvas = document.querySelector('.canvas__item');
    this.toolsWrapper = document.querySelector('.tools__wrapper');
    this.allToolsItems = document.querySelectorAll('.tools__item');
    // * Tools : start
    this.penTool = new Pen();
    this.bucketTool = new Bucket();
    this.fillBucketTool = new FillBucket();
    this.eraserTool = new Eraser();
    this.rectangle = new Rectangle();
    this.circle = new Circle();
    this.move = new Move();
    this.crop = new Crop();
    this.colorPickerCanvas = new ColorPickerCanvas();
    // * Tool : end
    this.cloneCanvasBackground = new CloneCanvasBackground();
  }

  static canselDefaultRightClich(e) {
    e.preventDefault();
  }

  static cloneCanvas(prevCanvas) {
    // create a new canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.classList.add('canvas__item');
    const ctx = newCanvas.getContext('2d');

    // set dimensions
    newCanvas.width = prevCanvas.width;
    newCanvas.height = prevCanvas.height;

    // apply the old canvas to the new one
    ctx.drawImage(prevCanvas, 0, 0);

    // return the new canvas
    return newCanvas;
  }

  deletePrevFeature() {
    this.canvas = document.querySelector('.canvas__item'); // refresh link to actual canvas

    const prevCanvas = this.canvas;
    const newCanvas = CheckCurrentTool.cloneCanvas(prevCanvas);
    prevCanvas.parentNode.replaceChild(newCanvas, prevCanvas);

    this.canvas = newCanvas;

    this.cloneCanvasBackground.init();

    this.canvas.addEventListener('contextmenu', CheckCurrentTool.canselDefaultRightClich.bind(this));
  }

  highlight(targetToHighlite) {
    const arrayOfTools = [...this.allToolsItems];

    arrayOfTools.map((i) => {
      i.classList.remove('highlight_tool');
    });

    targetToHighlite.classList.add('highlight_tool');
  }

  setTool(target) {
    this.deletePrevFeature();

    switch (currentTool) {
      case 'pen':
        this.penTool.init();
        break;

      case 'eraser':
        this.eraserTool.init();
        break;

      case 'paint-bucket':
        this.bucketTool.init();
        break;

      case 'fill-bucket':
        this.fillBucketTool.init();
        break;

      case 'rectangle':
        this.rectangle.init();
        break;

      case 'circle':
        this.circle.init();
        break;

      case 'move':
        this.move.init();
        break;

      case 'crop':
        this.crop.init();
        break;

      case 'color-picker':
        this.colorPickerCanvas.init();
        break;

      default:
        this.penTool.init();
        break;
    }

    // Highlight choosen tool
    this.highlight(target);
  }

  defineTool(e) {
    let { target } = e;
    let toolToHighlit = null;

    while (target.tagName !== 'UL') {
      currentTool = target.getAttribute('data-tool');

      toolToHighlit = target;
      target = target.parentElement;
    }

    this.setTool(toolToHighlit);
  }

  static setCurrentTool(name) {
    currentTool = name;
  }

  activePreviousTool() {
    const currentActiveTool = document.querySelector('.highlight_tool');
    currentTool = currentActiveTool.getAttribute('data-tool');
    this.setTool(currentActiveTool);
  }

  init() {
    const currentActiveTool = document.querySelector('.highlight_tool');
    this.setTool(currentActiveTool);

    this.toolsWrapper.addEventListener('click', this.defineTool.bind(this));
  }
}
