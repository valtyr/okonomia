import { Command, flags } from '@oclif/command';

export default class Assets extends Command {
  static description = 'Utilities to manipulate assets in KV';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    const { args, flags } = this.parse(Assets);
    this.log(process.cwd());
    this._help();
  }
}
