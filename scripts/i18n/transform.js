const fs = require('fs');
const path = require('path');
const readline = require('readline');

const config = {
  formFilePath: 'from.log',
  toFilePath: 'to.log',
  include: 'Missing message',
  exclude: 'menu.*',
};

let readlineInterface = readline.createInterface({
  input: fs.createReadStream(path.resolve(__dirname, config.formFilePath)),
});

const results = new Set();

readlineInterface.on('line', (line) => {
  if (new RegExp(config.include, 'g').test(line)) {
    const item = line.match(/(?<=\")(.*?)(?=\")/g)[0].trim(); // 零宽断言
    results.add(item);
  }
});

readlineInterface.on('close', (line) => {
  const newToFilePath = path.resolve(__dirname, config.toFilePath);

  if (fs.existsSync(newToFilePath)) {
    fs.unlinkSync(newToFilePath);
  }

  for (let result of results) {
    if (new RegExp(config.exclude, 'g').test(result)) {
      continue;
    }
    const newResult = `'${result}' : '${result}',\n`;
    fs.appendFile(newToFilePath, newResult, (err) => {
      console.log(err);
    });
  }
});
