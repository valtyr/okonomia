import { Command, flags } from '@oclif/command';
import { prompt } from 'inquirer';
import Listr from 'listr';
import findGitRoot from 'find-git-root';
import fs from 'fs';
import { normalize } from 'path';
import { Miniflare } from 'miniflare';
import { glob as globCB } from 'glob';
import { promisify } from 'util';
import { exec as execCB } from 'child_process';

const glob = promisify(globCB);
const read = promisify(fs.readFile);
const exec = promisify(execCB);

export default class AssetsSync extends Command {
  static description = 'Sync assets with KV';

  static examples = ['$ ok assets:sync --env dev'];

  static flags = {
    help: flags.help({ char: 'h' }),
    env: flags.enum({
      char: 'e',
      options: ['dev', 'production', 'staging'],
      required: true,
      description: 'target environment',
    }),
    'no-confirm': flags.boolean({
      description: 'skip confimation prompt',
      default: false,
    }),
  };

  async run() {
    const { args, flags } = this.parse(AssetsSync);

    if (!flags['no-confirm'] && flags.env !== 'dev') {
      const result = await prompt({
        name: 'confirmed',
        type: 'confirm',
        message: 'Are you sure you want to do this?',
      });
      if (!result.confirmed) {
        this.log("😕 OK that's fine I guess");
        this.exit(1);
      }
    }

    const tasks = new Listr([
      {
        title: 'Find git root',
        task: async ctx => {
          ctx.originalCWD = process.cwd();
          const gitRoot = findGitRoot();
          if (!gitRoot) throw new Error("Couldn't find git root.");
          ctx.rootDir = normalize(`${gitRoot}/..`);
          process.chdir(ctx.rootDir);
        },
      },
      {
        title: 'Check for assets folder',
        task: async ctx => {
          const exists = fs.existsSync('./packages/worker/assets');
          if (!exists)
            throw new Error('./packages/worker/assets directory not found.');
          const isDir = fs.lstatSync('packages/worker/assets').isDirectory();
          if (!isDir)
            throw new Error('packages/worker/assets should be a directory.');
        },
      },
      {
        title: 'Sync local assets',
        task: async ctx => {
          process.chdir('./packages/worker');

          const mf = new Miniflare({
            buildCommand: undefined,
          });

          const KVAssets = await mf.getKVNamespace('ASSETS');
          const listing = await KVAssets.list();
          const deletePromises = listing.keys.map(async ({ name }) => {
            await KVAssets.delete(name);
          });
          await Promise.all(deletePromises);

          const files = await glob('assets/**/*');
          const putPromises = files.map(async path => {
            const data = await read(path);
            await KVAssets.put(path, data);
          });
          await Promise.all(putPromises);

          process.chdir(ctx.rootDir);
        },
        enabled: () => flags.env === 'dev',
      },
      {
        title: 'Sync remote assets',
        task: async ctx => {
          process.chdir('./packages/worker');

          const files = await glob('assets/**/*');
          const putPromises = files.map(async path => {
            return exec(
              `wrangler kv:key put -e ${flags.env} -p "${path}" "${path}" --binding ASSETS`,
            );
          });

          try {
            await Promise.all(putPromises);
          } catch (e) {
            throw e;
          }

          process.chdir(ctx.rootDir);
        },
        enabled: () => ['staging', 'production'].includes(flags.env),
      },
    ]);

    try {
      await tasks.run();
    } catch (e) {
      console.log(process.cwd());
      this.exit(1);
    }
  }
}
