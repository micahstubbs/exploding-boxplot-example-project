## exploding-boxplot-example-project

a [es2015](https://babeljs.io/docs/learn-es2015/) [d3 v3](https://github.com/d3/d3-3.x-api-reference/blob/master/API-Reference.md) fork of the bl.ock [reusable updating exploding boxplot](http://bl.ocks.org/TennisVisuals/1ad22a71d7eb71fc26f8) from [@tennisvisuals](https://twitter.com/tennisvisuals)

---

#### Original `README.md`

---


# reusable updating exploding boxplot

### Design based on original: [mcaule](http://mcaule.github.io/d3_exploding_boxplot/)

#### [See this block in production with Live Data](http://tennisvisuals.com/Distributions/)

### Features:
- Dynamic data transitions
- Events are configurable as options such that external functions can be seamlessly integrated
 - e.g. external tooltips can be configured for mouseover events

```
var container = d3.select('body');
var xbp = explodingBoxplot();
xbp.options({
  data: {
    group: 'Set Score',
    color_index: 'Set Score',
    identifier: 'h2h'
  },
  axes: {
    x: { label: 'Set Score' },
    y: { label: 'Total Points' }
  }
});
xbp.data(data);
container.call(xbp);
xbp.update();

```
Change the dimension for y axis:
```
xbp.options( { axes: { y: { label: 'Total Shots' } } });
xbp.update();
```
Data for this example was generated by [mcpParse](https://github.com/TennisVisuals/mcp-charting-points-parser/blob/master/examples/shotsAndPoints.md)

### Accessors:
#### *by default accessors with no parameters return current values*
- chart.options(object) // for options that don't have accessors
- chart.width(width)
- chart.height(height)
- chart.data(data) // set data
- chart.update() // update chart
- chart.colors(object) // chart.colors({'group': 'color1', 'group': 'color2'})
- chart.events()  // trigger functions for i.e. mouseover/mouseout events

##### operations on data held in chart instance
- chart.pop()
- chart.push(row) -or- chart.push([row, row])