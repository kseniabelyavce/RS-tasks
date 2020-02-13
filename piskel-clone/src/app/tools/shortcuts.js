/* eslint-disable consistent-return */
/* eslint-disable default-case */

import CheckCurrentTool from './checkCurrentTool';

export default class Shortcuts {
  constructor() {
    this.checkCurrentTool = new CheckCurrentTool();
    this.allToolsItems = document.querySelectorAll('.tools__item');
  }

  static selectTool(e) {
    switch (e.keyCode) {
      case 80: // * P key
        this.getTool('pen');
        break;
      case 66: // * B key
        this.getTool('paint-bucket');
        break;
      case 65: // * A key
        this.getTool('fill-bucket');
        break;
      case 69: // * E key
        this.getTool('eraser');
        break;
      case 82: // * R key
        this.getTool('rectangle');
        break;
      case 67: // * C key
        this.getTool('circle');
        break;
      case 77: // * M key
        this.getTool('move');
        break;
      case 83: // * S key
        this.getTool('crop');
        break;
      case 79: // * O key
        this.getTool('color-picker');
        break;
    }
  }

  getTool(name) {
    CheckCurrentTool.setCurrentTool(name);

    this.allToolsItems.forEach((i) => {
      const toolName = i.getAttribute('data-tool');

      if (toolName === name) { return this.checkCurrentTool.setTool(i); }
    });
  }

  init() {
    window.addEventListener('keydown', Shortcuts.selectTool.bind(this));
  }
}
