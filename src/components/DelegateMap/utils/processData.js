import * as d3 from 'd3';
import * as topojson from 'topojson';
import { STATES_AND_TERRITORIES } from 'us';
import usmap from './../data/us.json';
import { format } from 'date-fns'

const nonStates = ['03', '07', '11', '14', '43', '52', '60', '66', '69', '72', '78'];

const names = {
  Biden: 'Joe Biden',
  Buttigieg: 'Pete Buttigieg',
  Bloomberg: 'Mike Bloomberg',
  Klobuchar: 'Amy Klobuchar',
  Sanders: 'Bernie Sanders',
  Steyer: 'Tom Steyer',
  Warren: 'Elizabeth Warren',
  Gabbard: 'Tulsi Gabbard',
}

const slugs = {
  Biden: 'joe-biden',
  Buttigieg: 'pete-buttigieg',
  Bloomberg: 'mike-bloomberg',
  Klobuchar: 'amy-klobuchar',
  Sanders: 'bernie-sanders',
  Steyer: 'tom-steyer',
  Warren: 'elizabeth-warren',
  Gabbard: 'tulsi-gabbard'
}

export function processData(statesData, territoriesData, results) {
  const resultsToUse = results.filter(a => a.delegates > 0 && a.party === 'Dem');

  /**
  Calculate totals
  ***/
  const totals = d3.nest()
    .key(a => a.name)
    .entries(resultsToUse);

  totals.forEach((a, i) => {
    a.delegates = d3.sum(a.values.map(a => a.delegates));
  })

  totals.sort((a, b) => b.delegates - a.delegates);

  totals.forEach((a, i) => {
    a.full_name = names[a.key];
    a.slug = slugs[a.key];
    //a.status = candidates.filter(b => b.Candidate === a.key)[0].Status;

    if (i === 0) {
      a.end = a.delegates;
    } else {
      a.end = +totals[i - 1].end + +totals[i].delegates;
    }
  });


  /**
  Calculate and assign data to map features
  ***/
  const map = topojson.feature(usmap, usmap.objects.cb_2017_us_state_20m);

  // Filter out DC and territories
  map.features = map.features.filter(a => !nonStates.includes(a.properties.STATEFP));

  // Append delegate data
  map.features.forEach(a => {
    const stateData = STATES_AND_TERRITORIES.filter(b => b.fips === a.properties.STATEFP)[0];
    // Append results - only democrats who won delegates;
    const result = resultsToUse.filter(b => b.state_abbr === stateData.abbr.toLowerCase())
    const hasDelegates = result.length > 0 ? result : [];
    if (result.length > 0) {
      hasDelegates.sort((c, d) => d.delegates - c.delegates);
      hasDelegates.forEach((b, i) => {
        b.slug = slugs[b.name];
        if (i === 0) {
          b.end = b.delegates;
        } else {
          b.end = +hasDelegates[i - 1].end + +hasDelegates[i].delegates;
        }
      })
    }
    // const stusps = stateData.STUSPS;
    //console.log(a, delegates)
    a.delegates = statesData.filter(b => b.State === stateData.abbr)[0];
    a.stateData = stateData;
    a.results = hasDelegates;
  });

  territoriesData.forEach(a => {
    const result = resultsToUse.filter(b => b.state_abbr === a.Abbrev);
    a.results = result;
  })

  return {
    totals: totals,
    mapData: map,
    territoriesData: territoriesData,
  };
}
