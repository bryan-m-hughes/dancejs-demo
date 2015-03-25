R.ready(function() {
  if (R.authenticated()) {
    render();
  } else {
    R.authenticate(function() {
      render();
    });
  }
});

var searchResults = [];
var selectedItem;
var isStopped = true;
var isPlaying = false;

function onSearchClicked() {
  R.request({
    method: 'search',
    content: {
      query: document.getElementById('search_input').value,
      types: 'Track'
    },
    success: function(response) {
      searchResults = response.result.results;
      render();
    }
  });
}

function onItemClicked(track) {
  isStopped = true;
  isPlaying = false;
  R.player.pause();
  selectedItem = track;
  render();
}

function onPlayClicked(track) {
  if (isStopped) {
    isStopped = false;
    isPlaying = true;
    R.player.play({
      source: track.key
    });
  } else {
    isPlaying = !isPlaying;
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
        <div className="form-group"><input id="search_input" className="form-control"></input></div>
        <button className="btn btn-primary" onClick={onSearchClicked}>Search</button>
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
        <img src={track.icon} className="play_info_icon" />
        <div>{track.name}</div>
        <div className="subinfo">{track.artist}</div>
        <div className="subinfo">{track.album}</div>
        <button className="btn btn-primary" onClick={this.onClicked}>{isPlaying ? 'Pause' : 'Play'}</button>
      </div>
    );
  }
});
