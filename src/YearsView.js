'use strict';

var React = require('react'),
  createReactClass = require('create-react-class');

// var DOM = React.DOM;
var DateTimePickerYears = createReactClass({
  render: function() {
    var year = parseInt(this.props.viewDate.year() / 10, 10) * 10;

    return React.createElement('div', { className: 'rdtYears' }, [
      React.createElement(
        'table',
        { key: 'a' },
        React.createElement(
          'thead',
          {},
          React.createElement('tr', {}, [
            React.createElement(
              'th',
              { key: 'prev', className: 'rdtPrev' },
              React.createElement(
                'button',
                {
                  onClick: this.props.subtractTime(10, 'years'),
                  type: 'button',
                },
                '‹'
              )
            ),
            React.createElement(
              'th',
              {
                key: 'year',
                className: 'rdtSwitch',
                onClick: this.props.showView('years'),
                colSpan: 2,
              },
              year + '-' + (year + 9)
            ),
            React.createElement(
              'th',
              { key: 'next', className: 'rdtNext' },
              React.createElement(
                'button',
                { onClick: this.props.addTime(10, 'years'), type: 'button' },
                '›'
              )
            ),
          ])
        )
      ),
      React.createElement(
        'table',
        { key: 'years' },
        React.createElement('tbody', {}, this.renderYears(year))
      ),
    ]);
  },

  renderYears: function(year) {
    var years = [],
      i = -1,
      rows = [],
      renderer = this.props.renderYear || this.renderYear,
      selectedDate = this.props.selectedDate,
      classes,
      props;

    year--;
    while (i < 11) {
      classes = 'rdtYear';
      if ((i === -1) | (i === 10)) classes += ' rdtOld';
      if (selectedDate && selectedDate.year() === year) classes += ' rdtActive';

      props = {
        key: year,
        'data-value': year,
        className: classes,
        onClick:
          this.props.updateOn == 'years'
            ? this.updateSelectedYear
            : this.props.setDate('year'),
      };

      years.push(renderer(props, year, selectedDate && selectedDate.clone()));

      if (years.length == 4) {
        rows.push(React.createElement('tr', { key: i }, years));
        years = [];
      }

      year++;
      i++;
    }

    return rows;
  },

  updateSelectedYear: function(event) {
    this.props.updateSelectedDate(event, true);
  },

  renderYear: function(props, year, selectedDate) {
    return React.createElement('td', props, year);
  },
});

module.exports = DateTimePickerYears;
