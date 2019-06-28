var DateTime = require('../DateTime.js');
var React = require('react');
var ReactDom = require('react-dom');

ReactDom.render(
  React.createElement(DateTime, { timeFormat: true }),
  document.getElementById('datetime')
);
