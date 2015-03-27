/*
Copyright (c) 2015 Bryan Hughes <bryan@theoreticalideations.com>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the 'Software'), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var searchResults = [];
var selectedItem;
var state = 'stopped';

R.ready(function() {
  if (R.authenticated()) {
    render();
  } else {
    R.authenticate(function() {
      render();
    });
  }
});

function onSearchClicked() {
  R.request({
    method: 'search',
    content: {
      types: 'Track',
      query: document.getElementById('search_input').value
    },
    success: function(response) {
      if (response.result.results) {
        searchResults = response.result.results;
      }
      render();
    }
  });
}

function onItemClicked(track) {
  R.player.pause();
  state = 'stopped';
  selectedItem = track;
  render();
}

function onPlayClicked(track) {
  if (state == 'stopped') {
    state = 'playing';
    R.player.play({
      source: track.key
    });
  } else {
    state = state == 'playing' ? 'paused' : 'playing';
    R.player.togglePause();
  }
  render();
}

function render() {
  React.render(
    <App />,
    document.getElementById('app')
  );
}

var App = React.createClass({
  render: function() {
    return (
      <div className="app">
        <Search />
        <Play />
      </div>
    );
  }
});

var Search = React.createClass({
  render: function() {
    return (
      <div className="search_container">
        <div className="search_controls">
          <input id="search_input" className="form-control"></input>
          <button className="btn btn-primary" onClick={onSearchClicked}>Search</button>
        </div>
        <SearchResults searchResults={searchResults} />
      </div>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var nodes = this.props.searchResults.map(function(result) {
      return (
        <SearchResultItem
          track={result}
          key={result.key}
          />
      );
    });
    return (
      <div className="search_results">
        {nodes}
      </div>
    );
  }
});

var SearchResultItem = React.createClass({
  onClicked: function() {
    onItemClicked(this.props.track);
  },
  render: function() {
    var track = this.props.track;
    return (
      <div className="search_result_item" onClick={this.onClicked}>
        <img src={track.icon} className="search_result_icon" />
        <div className="search_result_info">
          <div className="search_result_title">{track.name}</div>
          <div className="subinfo">{track.artist + '-' + track.album}</div>
        </div>
        <div className="search_result_duration">
          {Math.floor(track.duration / 60) + ':' + ('0' + track.duration % 60).substr(-2)}
        </div>
      </div>
    );
  }
});

var Play = React.createClass({
  render: function() {
    return selectedItem ? <PlayInfo track={selectedItem} /> : <div></div>;
  }
});

var PlayInfo = React.createClass({
  onClicked: function() {
    onPlayClicked(this.props.track);
  },
  render: function() {
    var track = this.props.track;
    return (
      <div className="play_container">
        <img src={track.icon400} className="play_info_icon" />
        <div>{track.name}</div>
        <div className="subinfo">{track.artist}</div>
        <div className="subinfo">{track.album}</div>
        <button className="btn btn-primary" onClick={this.onClicked}>{state == 'playing' ? 'Pause' : 'Play'}</button>
      </div>
    );
  }
});
