## Unreleased - Remote FS Next

* Rebrand the maintained fork while preserving settings, command IDs, and URI schemes.
* Update the SSH/SFTP stack to `ssh2` 1.x, removing the obsolete `ssh2-streams` dependency that triggers the `isDate` runtime error on current Node.js versions.
* Update TypeScript, VS Code typings, linting, and packaging tooling for current VS Code releases.

## 0.0.15 - 2019-04-27
* Fix [#56](https://github.com/liximomo/vscode-remote-fs/issues/56).
  
## 0.0.13 - 2019-01-08
* Custom label of the root folder by setting `remotefs.rootLabel`.

## 0.0.11 - 2018-08-14
* Open remote from terminal [CLI](https://github.com/liximomo/vscode-remote-fs#cli).
* Better suuport for symbolic link.
