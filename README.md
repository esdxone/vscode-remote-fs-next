# Remote FS Next for VS Code

Remote FS Next is a maintained fork of [Remote FS](https://github.com/liximomo/vscode-remote-fs), originally created by liximomo (X.L). It preserves the original extension's `remotefs.remote` settings, `remotefs.*` commands, and `ftp://` and `sftp://` URI schemes.

Working with any file in everywhere like they are in local with vscode.

## What's different in Remote FS Next

* Supports current Visual Studio Code releases with updated TypeScript and VS Code API typings.
* Uses the maintained `ssh2` 1.x stack instead of the obsolete `ssh2` 0.8 / `ssh2-streams` stack, fixing the `isDate` runtime error on current Node.js versions without patching `node_modules`.
* Uses current linting, testing, and VSIX packaging tooling.
* Includes automated checks that protect the public Remote FS compatibility contracts.
* Uses the Remote FS Next name and the maintained fork's repository, issue tracker, and project links.
* Keeps existing configurations and workspaces compatible: `remotefs.remote`, `remotefs.*`, `ftp://`, and `sftp://` remain unchanged.

## Attribution and license

This project is derived from the original Remote FS project by liximomo (X.L). The original copyright notice and MIT License are retained in [LICENSE](LICENSE); additional attribution is recorded in [NOTICE.md](NOTICE.md).

## Features

* Open remote from `code` CLI.
* Provide multiple schemes(sftp, ftp). More is coming!
* Password/Passphrase Prompting.
* Multiple remote folders at once.

## Setup

1.  Open User Settings.

    * On Windows/Linux - File > Preferences > Settings
    * On macOS - Code > Preferences > Settings

2.  Add your remote configs to "remotefs.remote" in your User Settings.
3.  `Cmd+Shift+P` open command palette(`Ctrl+Shift+P` on Windows/Linux), run `Remote FS: Add Folder to Workspace` command.
4.  Enjoy it😘!

## Config

```json
{
  "remotefs.remote": {
    "dev": {
      "scheme": "sftp",
      "host": "host",
      "username": "username",
      "rootPath": "/path/to/somewhere"
    },
    "site": {
      "scheme": "ftp",
      "host": "host",
      "username": "username"
    },
    "projectX": {
      "scheme": "sftp",
      "host": "host",
      "username": "username",
      "privateKeyPath": "/Users/xx/.ssh/id_rsa",
      "rootPath": "/home/foo/some/projectx"
    }
  }
}
```

You can find extra options with auto complete(Ctrl+Space)!

You can also see the full config [here](https://github.com/liximomo/vscode-remote-fs/wiki/config).

## CLI
Once you've config your remote in User Setting. You can open any remote from `code` CLI in your terminal.

### Usage

```
code --folder-uri <scheme>://<remote>[/path]
```

### Example

Setting: 

```
{
  "remotefs.remote": {
    "test": {
      "scheme": "ftp",
      "host": "host",
      "username": "username"
    },
    "projectX": {
      "scheme": "sftp",
      "host": "host",
      "username": "username",
      "privateKeyPath": "/Users/xx/.ssh/id_rsa",
      "rootPath": "/home/foo/some/projectx"
    }
  }
}
```

Open projectX at `rootPath`（/home/foo/some/projectx）.

```
code --folder-uri sftp://projectX/
```

Open projectX at `rootPath/dirA` (/home/foo/some/projectx/dirA).

```
code --folder-uri sftp://projectX/dirA
```

Open test at `rootPath`.

```
code --folder-uri ftp://test/
```
