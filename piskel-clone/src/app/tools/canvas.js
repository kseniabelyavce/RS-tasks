/* eslint-disable import/no-named-as-default */
import ColorPicker from './color-picker';
import Frames from './frames';
import DeleteFrame from './deleteFrame';
import SetFramePrev from './setFramePrev';
import AddNewFrame from './addNewFrame';
import CloneFrameTool from './cloneFrameTool';
import SelectFrameTool from './selectFrameTool';
import ShowCurrentFrame from './showCurrentFrame';
import PreviewTool from './preview';
import ResizeTool from './resizeTool';
import ResizeOfCanvas from './resizeOfCanvas';
// eslint-disable-next-line import/no-named-as-default-member
import CanvasData from './canvasData';
import FullScreenTool from './fullScreenTool';
import CheckCurrentTool from './checkCurrentTool';
import Shortcuts from './shortcuts';
import Flip from './flip';
import Rotation from './rotation';
import InvertColors from './invertColors';
import DragAndDrop from './drag&drop';


export default class Canvas {
  constructor() {
    this.canvas = document.querySelector('.canvas__item');
    this.emptyDataURL = this.canvas.toDataURL();
    this.setFramePrev = new SetFramePrev(this.emptyDataURL);
    this.addNewFrame = new AddNewFrame();
    this.canvasData = new CanvasData();
    this.addFrameButton = document.querySelector('.frames__add-frame-button');
    this.canvasWrapper = document.querySelector('#canvas__wrapper');
    this.shortcuts = new Shortcuts();
    this.flip = new Flip();
    this.rotation = new Rotation();
    this.invertColors = new InvertColors();
    this.flipButton = document.querySelector('.flip__button');
    this.rotationButton = document.querySelector('.rotation__button');
    this.invertColorsButton = document.querySelector('.invert__button');
    this.dragAndDrop = new DragAndDrop();
  }

  init() {
    this.canvasWrapper.addEventListener('contextmenu', this.canselDefaultRightClich);

    // Check/set current tool
    const checkCurrentTool = new CheckCurrentTool();
    checkCurrentTool.init();

    const colorPicker = new ColorPicker();
    colorPicker.init();

    const frames = new Frames();
    frames.init();

    const deleteFrame = new DeleteFrame();
    deleteFrame.init();

    const cloneFrameTool = new CloneFrameTool();
    cloneFrameTool.init();


    // Drag & drop (frames)
    this.dragAndDrop.init();

    const previewTool = new PreviewTool();
    previewTool.init();


    // Resisings
    const resizeTool = new ResizeTool();
    resizeTool.init();

    const resizeOfCanvas = new ResizeOfCanvas();
    resizeOfCanvas.init();
    resizeOfCanvas.changeSize();


    // Fullscreen mode for preview
    const fullScreenTool = new FullScreenTool();
    fullScreenTool.init();


    // Flip tool
    this.flip.init();

    // Rotation tool
    this.rotation.init();

    // Invert Colors tool
    this.invertColors.init();


    // Add frame preview
    this.canvasWrapper.addEventListener('click', this.setFramePrev.init.bind(this));
    this.canvasWrapper.addEventListener('contextmenu', this.setFramePrev.init.bind(this));
    this.flipButton.addEventListener('click', this.setFramePrev.init.bind(this));
    this.rotationButton.addEventListener('click', this.setFramePrev.init.bind(this));
    this.invertColorsButton.addEventListener('click', this.setFramePrev.init.bind(this));

    // Add feature to add new frame
    this.addFrameButton.addEventListener('click', this.addNewFrame.addFrame.bind(this.addNewFrame));

    const selectFrameTool = new SelectFrameTool();
    selectFrameTool.init();

    // Highlight selected frames
    this.firstFrame = document.querySelector('.frame__unit');
    this.firstFrame.style.borderColor = 'rgb(255, 215, 0)';
    const showCurrentFrame = new ShowCurrentFrame();
    showCurrentFrame.init();

    // Show canvas data
    this.canvasData.init();

    // Shortcuts
    this.shortcuts.init();
  }
}
