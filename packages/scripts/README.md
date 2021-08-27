@okonomia/scripts
=================

&gt; TODO: description

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@okonomia/scripts.svg)](https://npmjs.org/package/@okonomia/scripts)
[![Downloads/week](https://img.shields.io/npm/dw/@okonomia/scripts.svg)](https://npmjs.org/package/@okonomia/scripts)
[![License](https://img.shields.io/npm/l/@okonomia/scripts.svg)](https://github.com/[object Object]/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @okonomia/scripts
$ ok COMMAND
running command...
$ ok (-v|--version|version)
@okonomia/scripts/0.0.0 darwin-x64 node-v14.17.0
$ ok --help [COMMAND]
USAGE
  $ ok COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ok hello [FILE]`](#ok-hello-file)
* [`ok help [COMMAND]`](#ok-help-command)

## `ok hello [FILE]`

describe the command here

```
USAGE
  $ ok hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ok hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/valtyr/okonomia/blob/v0.0.0/src/commands/hello.ts)_

## `ok help [COMMAND]`

display help for ok

```
USAGE
  $ ok help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
