const ora = require('ora');

class Spinner {
  constructor(options = {
    text: 'Loading',
    color: 'green'
  }) {
    this.ora = ora;
    this.options = options;
    this.spinner = null;
  }

  setOptions(options = this.options) {
    const ops = {...this.options, ...options};
    this.spinner.color = ops.color;
    this.spinner.text = ops.text;
  }

  start(desc) {
    this.spinner = this.ora(desc);
    const {
      color,
      text
    } = this.options;
    this.spinner.color = color;
    this.spinner.text = text;
    this.spinner.start();
  }

  stop(text) {
    if(this.spinner) {
      this.spinner.succeed(text);
      this.spinner.stop();
    }
  }

  fail(text) {
    this.spinner.color = 'red';
    this.spinner && this.spinner.fail(text);
  }
}

const spinner = new Spinner();

module.exports = {
  spinner
}