const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
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

test('imports CommonJS constructors through their default export', () => {
  const ftpProvider = fs.readFileSync(
    path.join(__dirname, '../src/fs-providers/FTPProvider.ts'),
    'utf8'
  );

  assert.match(ftpProvider, /import PQueue from 'p-queue';/);
});
