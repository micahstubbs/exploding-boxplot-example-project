/*
eslint
no-undef: "off",
func-names: "off",
no-use-before-define: "off",
no-console: "off",
no-unused-vars: "off",
no-unused-expressions: "off"
*/
const boxPlotFunctions = {};

boxPlotFunctions.removeTooltip = removeTooltip;
function removeTooltip(d, i, element) {
  if (!$(element).popover) return;
  $('.popover').each(function () {
    $(this).remove();
  });
}

boxPlotFunctions.showTooltip = showTooltip;
function showTooltip(d, i, element, constituents, options) {
  if (!$(element).popover) return;
  $(element).popover({
    placement: 'auto top',
    container: `#${constituents.elements.domParent.attr('id')}`,
    trigger: 'manual',
    html: true,
    content() {
      const identifier = options.data.identifier && d[options.data.identifier] ?
             d[options.data.identifier] : 'undefined';

      const value = options.axes.y.label && d[options.axes.y.label] ?
             options.axes.y.tickFormat(d[options.axes.y.label]) : '';

      let message = "<span style='font-size: 11px; text-align: center;'>";
      message += `${d[options.data.identifier]}: ${d[options.axes.y.label]}</span>`;

      return message;
    }
  });
  $(element).popover('show');
}

boxPlotFunctions.defineTooltip = defineTooltip;
function defineTooltip(constituents, options, events) {
  const tip = d3.tip().attr('class', 'explodingBoxplot tip')
          .direction('n')
          .html(tipFunction);

  function tipFunction(d) {
    const color = options.data.color_index && d[options.data.color_index] ?
           constituents.scales.color(d[options.data.color_index]) : 'blue';

    const identifier = options.data.identifier && d[options.data.identifier] ?
           d[options.data.identifier] : 'undefined';

    const value = options.axes.y.label && d[options.axes.y.label] ?
           options.axes.y.tickFormat(d[options.axes.y.label]) : '';

    const message = `<span style="color:${color}">${identifier}</span>
      <span style="color:#DDDDDD;" > : ${value}</span>`;
    return message;
  }

  events.point.mouseover = tip.show;
  events.point.mouseout = tip.hide;

  if (constituents.elements.chartRoot) constituents.elements.chartRoot.call(tip);
}

boxPlotFunctions.defaultDistribution = defaultDistribution;
function defaultDistribution(tooltip) {
  const defaultDistributions = 'atpWta.json';
  const container = d3.select('#pointDistributions');

  d3.json(defaultDistributions, (error, result) => {
    if (error || !result) return;

    const xbp = explodingBoxplot();
    boxPlotFunctions.xbp = xbp;

    if (tooltip) {
      if (tooltip === 'popover') {
        xbp.events({
          point: {
            mouseover: showTooltip,
            mouseout: removeTooltip
          }
        });
      }
      if (tooltip === 'd3-tip') {
        xbp.events({
          update: {
            ready: defineTooltip
          }
        });
      }
    }

    xbp.options(
      {
        id: 'demo',
        data: {
          group: 'Set Score',
          color_index: 'Set Score',
          identifier: 'h2h'
        },
        width: 700,
        height: 480,
        axes: {
          x: { label: 'Set Score' },
          y: { label: 'Total Points' }
        }
      }
       );

    xbp.data(result.data);
    container.call(xbp);
    xbp.update();
  });
}

boxPlotFunctions.demoSetup = demoSetup;
function demoSetup() {
  let data;
  let originalWidth;
  let originalHeight;

  const vizcontrol = d3.select('#controls');
  const viztable = vizcontrol.append('table')
    .attr('align', 'center');

  const row1 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row1.append('input')
    .attr('name', 'tooltip')
    .attr('id', 'popover')
    .attr('type', 'radio')
    .attr('value', 'popover');

  row1.append('label')
    .html('&nbsp; Bootstrap Popover')
    .style('font-size', '12px');

  document.getElementById('popover').addEventListener('change', () => {
    boxPlotFunctions.xbp.events({
      point: {
        mouseover: showTooltip,
        mouseout: removeTooltip
      },
      update: { ready: null }
    });
  });

  const row2 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row2.append('input')
    .attr('name', 'tooltip')
    .attr('id', 'd3tip')
    .attr('type', 'radio')
    .attr('value', 'd3tip')
    .attr('checked', 'checked');

  row2.append('label')
    .html('&nbsp; d3-tip Tooltip')
    .style('font-size', '12px');

  document.getElementById('d3tip').addEventListener('change', () => {
    boxPlotFunctions.xbp.events({
      update: { ready: defineTooltip }
    });
    boxPlotFunctions.xbp.update();
  });

  const row3 = viztable.append('tr')
    .append('td')
    .append('hr');

  const row4 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row4.append('input')
    .attr('name', 'colors')
    .attr('id', 'shuffle')
    .attr('type', 'radio')
    .attr('value', 'shuffle');

  row4.append('label')
    .html('&nbsp; Shuffle Colors')
    .style('font-size', '12px');

  document.getElementById('shuffle').addEventListener('change', () => {
    const shuffleColors = {
      7: '#a6cee3',
      4: '#ff7f00',
      1: '#b2df8a',
      3: '#1f78b4',
      2: '#fdbf6f',
      0: '#33a02c',
      5: '#cab2d6',
      8: '#6a3d9a',
      9: '#fb9a99',
      6: '#e31a1c',
      11: '#ffff99',
      10: '#b15928'
    };
    boxPlotFunctions.xbp.colors(shuffleColors);
    boxPlotFunctions.xbp.update();
  });

  const row5 = viztable
    .append('tr')
    .append('td')
    .attr('align', 'left');

  row5.append('input')
    .attr('name', 'colors')
    .attr('id', 'default')
    .attr('type', 'radio')
    .attr('value', 'default')
    .attr('checked', 'checked');

  row5.append('label')
    .html('&nbsp; Default Colors')
    .style('font-size', '12px');

  document.getElementById('default').addEventListener('change', () => {
    boxPlotFunctions.xbp.colors({ foo: 'bogus' });
    boxPlotFunctions.xbp.update();
  });

  const row6 = viztable.append('tr')
    .append('td')
    .append('hr');

  const row7 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row7.append('input')
    .attr('name', 'size')
    .attr('id', 'resize')
    .attr('type', 'radio')
    .attr('value', 'resize');

  row7.append('label')
    .html('&nbsp; Resize')
    .style('font-size', '12px');

  document.getElementById('resize').addEventListener('change', () => {
    originalWidth = boxPlotFunctions.xbp.width();
    originalHeight = boxPlotFunctions.xbp.height();
    boxPlotFunctions.xbp.width(400).height(300);
    boxPlotFunctions.xbp.update();
  });

  const row8 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row8.append('input')
    .attr('name', 'size')
    .attr('id', 'original')
    .attr('type', 'radio')
    .attr('value', 'original')
    .attr('checked', 'checked');

  row8.append('label')
    .html('&nbsp; Original Dimensions')
    .style('font-size', '12px');

  document.getElementById('original').addEventListener('change', () => {
    if (originalWidth && originalHeight) {
      boxPlotFunctions.xbp.width(originalWidth).height(originalHeight);
      boxPlotFunctions.xbp.update();
    }
  });

  const row9 = viztable.append('tr')
    .append('td')
    .append('hr');

  const row10 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row10.append('input')
    .attr('name', 'data')
    .attr('id', 'slice')
    .attr('type', 'radio')
    .attr('value', 'slice');

  row10.append('label')
    .html('&nbsp; Slice Data')
    .style('font-size', '12px');

  document.getElementById('slice').addEventListener('change', () => {
    data = boxPlotFunctions.xbp.data();
    boxPlotFunctions.xbp.data(data.slice(1000, 3000));
    boxPlotFunctions.xbp.update();
  });

  const row11 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row11.append('input')
    .attr('name', 'data')
    .attr('id', 'full')
    .attr('type', 'radio')
    .attr('value', 'full')
    .attr('checked', 'checked');

  row11.append('label')
    .html('&nbsp; Original Data')
    .style('font-size', '12px');

  document.getElementById('full').addEventListener('change', () => {
    if (data) {
      boxPlotFunctions.xbp.data(data);
      boxPlotFunctions.xbp.update();
    }
  });

  let row12 = viztable
    .append('tr')
    .append('td')
    .append('hr');

  let row13 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row13.append('input')
    .attr('name', 'attribute')
    .attr('id', 'shots')
    .attr('type', 'radio')
    .attr('value', 'shots');

  row13.append('label')
    .html('&nbsp; Change Attribute')
    .style('font-size', '12px');

  document.getElementById('shots').addEventListener('change', () => {
    boxPlotFunctions.xbp.options({
      axes: {
        y: {
          label: 'Total Shots'
        }
      }
    });
    boxPlotFunctions.xbp.update();
  });

  const row14 = viztable.append('tr')
    .append('td')
    .attr('align', 'left');

  row14.append('input')
    .attr('name', 'attribute')
    .attr('id', 'points')
    .attr('type', 'radio')
    .attr('value', 'points')
    .attr('checked', 'checked');

  row14.append('label')
    .html('&nbsp; Original Attribute')
    .style('font-size', '12px');

  document.getElementById('points').addEventListener('change', () => {
    boxPlotFunctions.xbp.options({
      axes: {
        y: { label: 'Total Points' }
      }
    });
    boxPlotFunctions.xbp.update();
  });

  row12 = viztable.append('tr')
    .append('td')
    .append('hr');

  row13 = viztable.append('tr')
    .append('td')
    .attr('align', 'left')
    .html('Explode: click on boxes<br/>Reset: double-click background');
}
