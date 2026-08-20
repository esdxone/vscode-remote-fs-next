const assert = require('node:assert/strict');
const Module = require('node:module');
const test = require('node:test');

test('bundled extension activates and registers the compatibility command', () => {
  const originalLoad = Module._load;
  const commands = [];

  class Disposable {
    constructor(dispose) {
      this.dispose = dispose;
    }
  }

  class EventEmitter {
    constructor() {
      this.event = () => new Disposable(() => undefined);
    }

    fire() {}
  }

  const vscode = {
    commands: {
      registerCommand(command) {
        commands.push(command);
        return new Disposable(() => undefined);
      }
    },
    Disposable,
    EventEmitter,
    workspace: {
      registerFileSystemProvider() {
        return new Disposable(() => undefined);
      }
    }
  };

  Module._load = function load(request, parent, isMain) {
    return request === 'vscode' ? vscode : originalLoad.call(this, request, parent, isMain);
  };

  try {
    const extension = require('../dist/extension.js');
    const context = { subscriptions: [] };

    assert.doesNotThrow(() => extension.activate(context));
    assert.ok(commands.includes('remotefs.addFolderToWorkspace'));
  } finally {
    Module._load = originalLoad;
  }
});
