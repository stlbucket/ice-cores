/* global Plotly:true */

import React, { Component } from 'react';

import fetch from 'isomorphic-fetch';
import ReactJSONEditor from './components/ReactJSONEditor.react.js';
import Select from 'react-select';
import SplitPane from 'react-split-pane';

import createPlotlyComponent from 'react-plotly.js/factory'

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import './App.css';
import './styles/Resizer.css';

/* JSON Editor styling */
import './styles/autocomplete.css';
import './styles/contextmenu.css';
import './styles/jsoneditor.css';
import './styles/menu.css';
import './styles/reset.css';
import './styles/searchbox.css';

import 'react-select/dist/react-select.css';

const Plot = createPlotlyComponent(Plotly);

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink(),
  cache: new InMemoryCache(),
});

/*
const GET_DOGS = gql`
  {
    dogs {
      id
      breed
    }
  }
`;

const Dogs = ({ onDogSelected }) => (
  <Query query={GET_DOGS}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      return (
        <select name="dog" onChange={onDogSelected}>
          {data.dogs.map(dog => (
            <option key={dog.id} value={dog.breed}>
              {dog.breed}
            </option>
          ))}
        </select>
      );
    }}
  </Query>
);
*/

class App extends Component {

    constructor(props) {
        super(props);

        this.handleJsonChange = this.handleJsonChange.bind(this);
        this.getPlots = this.getPlots.bind(this);
        this.handleNewPlot = this.handleNewPlot.bind(this);
        
        const plotJSON = {
            data: [{
                x: [1,2,3,4],
                y: [1,3,2,6],
                type: 'bar',
                marker: {color: '#ab63fa'},
                name: 'Bar'
            }, {
                x: [1,2,3,4],
                y: [3,2,7,4],
                type: 'line',
                marker: {color: '#19d3f3'},
                name: 'Line'
            }],
            layout: {
                plotBackground: '#f3f6fa',
                margin: {t:0, r: 0, l: 20, b: 30},
            }
        };

        this.state = {
            json: plotJSON,
            plotUrl: ''
        };
    }
    
    handleJsonChange = newJSON => {
        this.setState({json: newJSON});
    }

    handleNewPlot = option => {
        let url = '';
        if ('value' in option) {
            url = option.value;
        }
        else if ('target' in option) {
            url = option.target.value;
            if (url.includes('http')) {
                if (!url.includes('.json')) {
                    url = url + '.json'
                }
            }
        }

        if(url) {
            fetch(url)
            .then((response) => response.json())
            .then((newJSON) => {
                if ('layout' in newJSON) {    
                    if ('height' in newJSON.layout) {
                        newJSON.layout.height = null;
                    }
                    if ('width' in newJSON.layout) {
                        newJSON.layout.width = null;
                    }
                }
                this.setState({
                    json: newJSON,
                    plotUrl: url
                });
            });
        }
    }
    
    getPlots = (input) => {
        if (!input) {
			return Promise.resolve({ options: [] });
		}

        let urlToFetch = `https://api.plot.ly/v2/search?q=${input}`;
        
		return fetch(urlToFetch)
		    .then((response) => response.json())
		    .then((json) => {
			    return { options: json.files.map(function(o) {
                    return {
                        label: `${o.filename} by ${o.owner}, ${o.views} views`,
                        value: o.web_url.replace(/\/$/, "") + '.json'
                    };
                })};
		    });
    };

    getMocks = () => {
		return fetch('https://api.github.com/repositories/45646037/contents/test/image/mocks')
		    .then((response) => response.json())
		    .then((json) => {
			    return {
                    complete: true,
                    options: json.map(function(o) {
                        return {
                            label: o.name,
                            value: o.download_url
                        };
                    })
                };
		    });
    };
    
    render() {

        let searchPlaceholder = 'Search charts on plot.ly by topic -- e.g. "GDP"';

        const plotInputPlaceholder = 'Link to plot JSON';

        let footnoteStyle = {
            fontSize: '12px',
            textAlign: 'left',
            width: '300px',
            overflowWrap: 'break-word',
            margin: '10px'
        }
        
        return (
            <div className="App">
                <SplitPane split="vertical" minSize={100} defaultSize={400}>
                    <div>
                        <div className='controls-panel'>
                           <Select.Async
                                name="plotlyjs-mocks"
                                loadOptions={this.getMocks}
                                placeholder={'Search plotly.js mocks'}
                                onChange={this.handleNewPlot}
                                className={'no-select'}
                           />
                       </div>
                       <ReactJSONEditor
                           json={this.state.json}
                           onChange={this.handleJsonChange}
                           plotUrl={this.state.plotUrl}
                       />                  
                    </div>                         
                    <div>
                       <div className='controls-panel'>
                            <Select.Async
                                name="plot-search-bar"
                                loadOptions={this.getPlots}
                                placeholder={searchPlaceholder}
                                onChange={this.handleNewPlot}
                                ref="plotSearchBar"
                                cache={false}
                                className={'no-select'}            
                            />
                            <br/>
                            <input
                                placeholder={plotInputPlaceholder}
                                onBlur={this.handleNewPlot}
                                style={{padding:'10px', width:'95%', border:0}}
                                value={this.state.plotUrl}
                                className={'no-select'}
                            />
                        </div>
                        <Plot
                            data={this.state.json.data}
                            layout={this.state.json.layout}
                            config={{displayModeBar: false}}
                        />
                    </div>
                </SplitPane>
            </div>
        );
    }
}

export default App;
