'use strict';

var React = require('react'),
  createReactClass = require('create-react-class');

// var DOM = React.DOM;
var DateTimePickerTime = createReactClass({
  getInitialState: function() {
    return this.calculateState(this.props);
  },
  calculateState: function(props) {
    var date = props.selectedDate || props.viewDate,
      format = props.timeFormat,
      counters = [];

    if (format.indexOf('H') != -1 || format.indexOf('h') != -1) {
      counters.push('hours');
      if (format.indexOf('m') != -1) {
        counters.push('minutes');
        if (format.indexOf('s') != -1) {
          counters.push('seconds');
        }
      }
    }

    return {
      hours: date.format('H'),
      minutes: date.format('mm'),
      seconds: date.format('ss'),
      milliseconds: date.format('SSS'),
      counters: counters,
    };
  },
  renderCounter: function(type) {
    return React.createElement('div', { key: type, className: 'rdtCounter' }, [
      React.createElement(
        'button',
        {
          key: 'up',
          className: 'rdtBtn',
          onMouseDown: this.onStartClicking('increase', type),
          type: 'button',
        },
        '▲'
      ),
      React.createElement(
        'div',
        { key: 'c', className: 'rdtCount' },
        this.state[type]
      ),
      React.createElement(
        'button',
        {
          key: 'do',
          className: 'rdtBtn',
          onMouseDown: this.onStartClicking('decrease', type),
          type: 'button',
        },
        '▼'
      ),
    ]);
  },
  render: function() {
    var me = this,
      counters = [];

    this.state.counters.forEach(function(c) {
      if (counters.length)
        counters.push(
          React.createElement(
            'div',
            { key: 'sep' + counters.length, className: 'rdtCounterSeparator' },
            ':'
          )
        );
      counters.push(me.renderCounter(c));
    });

    if (
      this.state.counters.length == 3 &&
      this.props.timeFormat.indexOf('S') != -1
    ) {
      counters.push(
        React.createElement(
          'div',
          { className: 'rdtCounterSeparator', key: 'sep5' },
          ':'
        )
      );
      counters.push(
        React.createElement(
          'div',
          { className: 'rdtCounter rdtMilli', key: 'm' },
          React.createElement('input', {
            value: this.state.milliseconds,
            type: 'text',
            onChange: this.updateMilli,
          })
        )
      );
    }

    return React.createElement(
      'div',
      { className: 'rdtTime' },
      React.createElement('table', {}, [
        this.renderHeader(),
        React.createElement(
          'tbody',
          { key: 'b' },
          React.createElement(
            'tr',
            {},
            React.createElement(
              'td',
              {},
              React.createElement('div', { className: 'rdtCounters' }, counters)
            )
          )
        ),
      ])
    );
  },
  componentWillReceiveProps: function(nextProps, nextState) {
    this.setState(this.calculateState(nextProps));
  },
  updateMilli: function(e) {
    var milli = parseInt(e.target.value);
    if (milli == e.target.value && milli >= 0 && milli < 1000) {
      this.props.setTime('milliseconds', milli);
      this.setState({ milliseconds: milli });
    }
  },
  renderHeader: function() {
    if (!this.props.dateFormat) return null;

    var date = this.props.selectedDate || this.props.viewDate;
    return React.createElement(
      'thead',
      { key: 'h' },
      React.createElement(
        'tr',
        {},
        React.createElement(
          'th',
          {
            className: 'rdtSwitch',
            colSpan: 4,
            onClick: this.props.showView('days'),
          },
          date.format(this.props.dateFormat)
        )
      )
    );
  },
  onStartClicking: function(action, type) {
    var me = this,
      update = {},
      value = this.state[type];

    return function() {
      var update = {};
      update[type] = me[action](type);
      me.setState(update);

      me.timer = setTimeout(function() {
        me.increaseTimer = setInterval(function() {
          update[type] = me[action](type);
          me.setState(update);
        }, 70);
      }, 500);

      me.mouseUpListener = function() {
        clearTimeout(me.timer);
        clearInterval(me.increaseTimer);
        me.props.setTime(type, me.state[type]);
        document.body.removeEventListener('mouseup', me.mouseUpListener);
      };

      document.body.addEventListener('mouseup', me.mouseUpListener);
    };
  },

  maxValues: {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  },
  padValues: {
    hours: 1,
    minutes: 2,
    seconds: 2,
    milliseconds: 3,
  },
  increase: function(type) {
    var value = parseInt(this.state[type]) + 1;
    if (value > this.maxValues[type]) value = 0;
    return this.pad(type, value);
  },
  decrease: function(type) {
    var value = parseInt(this.state[type]) - 1;
    if (value < 0) value = this.maxValues[type];
    return this.pad(type, value);
  },
  pad: function(type, value) {
    var str = value + '';
    while (str.length < this.padValues[type]) str = '0' + str;
    return str;
  },
});

module.exports = DateTimePickerTime;
