import { Console } from 'console';
import { TimestampStylesString } from 'discord.js';
import chalk from 'chalk';

type LogStyle = 'info' | 'err' | 'warn' | 'done';

interface Style {
  prefix?: string;
  logFunction: Console['log'];
  color: chalk.Chalk;
}

const log = (string: string, style?: LogStyle): void => {
  const styles: Record<LogStyle, Style> = {
    info: { prefix: '[INFO]', logFunction: console.log, color: chalk.blue },
    err: { prefix: '[ERROR]', logFunction: console.error, color: chalk.red },
    warn: { prefix: '[WARNING]', logFunction: console.warn, color: chalk.yellow },
    done: { prefix: '[SUCCESS]', logFunction: console.log, color: chalk.green },
  };

  const selectedStyle = style ? styles[style] : { logFunction: console.log, color: chalk.white };
  selectedStyle.logFunction(selectedStyle.color(`${selectedStyle.prefix || ''} ${string}`));
};

const time = (time: number, style?: TimestampStylesString): string => {
  return `<t:${Math.floor(time / 1000)}${style ? `:${style}` : ''}>`;
};

export { log, time };