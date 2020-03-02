import React from 'react';
import ReactDOM from 'react-dom';
import Tooltip from './Tooltip';
import { BaseChart, d3 } from '@politico/graphics-kit';
import { wrap } from './../../utils/helperFns.js';

// Filter only for Super Tuesday states
const superTuesday = ['01', '05', '06', '08', '23', '25', '27', '37', '40', '47', '48', '49', '50', '51'];
const territoryTuesday = ['AS'];

class Chart extends BaseChart {
  draw() {
    if (!this.selection()) { return; }
    const node = this.selection().node();
    const data = this.data()[0];
    const territories = this.data()[1];
    const div = d3.select(node).appendSelect('div', 'map-container');
    div.appendSelect('div', 'gradient');

    const width = div._groups[0][0].offsetWidth;
    const w = 1000;
    const h = w * 2 / 3;

    const tooltip = div.appendSelect('div', 'tooltip');

    const states = data.features;

    const path = d3.geoPath();
    const projection = d3.geoAlbersUsa().fitSize([w, h], data);
    path.projection(projection);

    const svg = div.appendSelect('svg', 'map')
      .attr('width', w)
      .attr('height', h)

    const svgTerritories = div.appendSelect('svg', 'territories')
      .attr('width', w)
      .attr('height', 100)

    const g = svg.appendSelect('g')
      .attr('transform', 'translate(' + (-width / 20) + ', 0)');

    const mapbase = g.selectAll('path.map-base')
      .data(states);

    mapbase
      .enter()
      .append('path')
      .attr('class', 'map-base')
      .merge(mapbase)
      .attr('d', path)
      .attr('d', d => {
        // Assign centroid
        d.centroid = path.centroid(d);
        return path(d);
      });

    const r = 7;
    // Draw rectangles for states
    data.features.forEach(state => {
      if (superTuesday.includes(state.properties.STATEFP)){
        const stats = state.delegates;
        const xTotal = +stats.Width;
        const yTotal = +stats.Height;

        const x0 = +stats.X_Offset * r;
        const y0 = +stats.Y_Offset * r;

        let x = x0;
        let y = y0;

        const scale = d3.scaleThreshold()
          .domain(state.results.map(a => +a.end))
          .range(state.results.map(a => a.slug).concat(['other']))

        function assignWinner(i) {
          if (state.results.length === 0) return;
          // const all = d3.sum(state.results.map(a => a.delegates));
          return scale(i);
        }

        for (let i = 1; i < +state.delegates.Pledged + 1; i++) {
          g.appendSelect('rect', `delegate ${state.stateData.abbr}-${i} ${assignWinner(i)} ${i <= +state.delegates.Pledged ? 'pledged' : 'automatic'}`)
            .attr('x', state.centroid[0] - xTotal * r / 2 + x)
            .attr('y', state.centroid[1] - yTotal * r / 2 + y)
            .attr('width', r)
            .attr('height', r)
            .on('mouseover', () => showTooltip(state))
            .on('mouseleave', () => hideTooltip());

          x = i % xTotal === 0 ? x0 : x += r;
          y = i % xTotal === 0 ? y += r : y;
        }

        // Append text
        g.appendSelect('text', `state-label ${state.stateData.abbr}`)
          .attr('x', state.centroid[0] - xTotal * r / 2 + x0)
          .attr('y', state.centroid[1] - yTotal * r / 2 - 2 + y0)
          .text(state.stateData.ap_abbr);
        }
    });

    // Append territories
    territories.forEach((territory, i) => {
      if (terirtoryTuesday.includes(territory.Abbrev)){
        const xTotal = territory.Abbrev === 'PR' ? 11 : 8; //Math.ceil(Math.sqrt(territory.Pledged));

        const x0 = i * 70 + 10;
        const y0 = 30;

        let x = x0;
        let y = y0;

        const scale = d3.scaleThreshold()
          .domain(territory.results.map(a => +a.end))
          .range(territory.results.map(a => a.slug).concat(['other']))

        function assignWinner(i) {
          if (territory.results.length === 0) return;
          // const all = d3.sum(state.results.map(a => a.delegates));
          return scale(i);
        }

        for (let i = 1; i < +territory.Pledged; i++) {
          svgTerritories.appendSelect('rect', `delegate ${territory.Abbrev}-${i} ${assignWinner(i)} ${i <= +territory.Pledged ? 'pledged' : 'automatic'}`)
            .attr('x', x)
            .attr('y', y)
            .attr('width', r)
            .attr('height', r)
            .on('mouseover', () => showTooltip(territory))
            .on('mouseleave', () => hideTooltip());

          x = i % xTotal === 0 ? x0 : x += r;
          y = i % xTotal === 0 ? y += r : y;
        }

        // Append text
        svgTerritories.appendSelect('text', `state-label ${territory.Abbrev}`)
          .attr('x', x0)
          .attr('y', y0 - 18)
          .text(territory.Name)
          .call(wrap, 55)
        }
    })

    function showTooltip(d){
      d3.selectAll('div.tooltip')
        .style('opacity', 1)

      const sum = d3.sum(d.results.map(a => a.delegates));
      ReactDOM.render(
        <Tooltip d={d} sum={sum} isTerritory={d.Abbrev !== undefined}/>,
        tooltip.node()
      );

      const coordinates = d3.mouse(node);
      const xPos = coordinates[0];
      const yPos = coordinates[1];

      const xStyle = xPos > (w * 0.50) ?
        `left:${xPos - 290}px;` : `left:${xPos + 25}px;`;
      const yStyle = yPos > (h * 0.55) ?
        `top:${(yPos - 15)}px;` : `top:${yPos + 15}px;`;

      tooltip.attr('style', `${xStyle}${yStyle}`)
        .classed('visible', true);
    }

    function hideTooltip(d) {
      d3.selectAll('div.tooltip')
        .style('opacity', 0)
    }

    return this;
  }
}

export default Chart;
