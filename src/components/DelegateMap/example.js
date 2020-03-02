import React from 'react';
import ReactDOM from 'react-dom';
import Page from 'Common/Page/';
import CodeBlock from 'Common/CodeBlock';

import DelegateMap from './index';
import data from './data/results.json';

const App = () => {
  return (
    <Page title='DelegateMap' page='DelegateMap'>
      <DelegateMap
        data={data}
      />

      <CodeBlock
        value={`import { DelegateMap } from '@politico/module_super-tuesday-delegate-map';

        <DelegateMap
          data={data}
        />
`}
      />
    </Page>
  );
};

export default App;

ReactDOM.render(<App />, document.getElementById('app'));
