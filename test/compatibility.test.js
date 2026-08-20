const assert = require('node:assert/strict');
const test = require('node:test');
const manifest = require('../package.json');

test('keeps the public Remote FS compatibility contracts', () => {
  assert.ok(manifest.contributes.configuration.properties['remotefs.remote']);
  assert.ok(manifest.contributes.configuration.properties['remotefs.rootLabel']);
  assert.ok(manifest.contributes.commands.some(({ command }) => command === 'remotefs.addFolderToWorkspace'));
  assert.ok(manifest.activationEvents.includes('onFileSystem:ftp'));
  assert.ok(manifest.activationEvents.includes('onFileSystem:sftp'));
});

test('uses the maintained SSH stack', () => {
  assert.match(manifest.dependencies.ssh2, /^\^1\./);
});
