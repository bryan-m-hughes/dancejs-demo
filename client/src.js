/*R.ready(function() {
  if (R.authenticated()) {
    start();
  } else {
    R.authenticate(function() {
      start();
    });
  }
});*/

function start() {
  React.render(
    <App />,
    document.getElementById('app')
  );
}

var searchResults = [{
  artist: 'Weezer',
  album: 'Weezer',
  title: 'Buddy Holly',
  duration: '3:15'
}, {
  artist: 'Weezer',
  album: 'Weezer',
  title: 'Say it Ain\'t So',
  duration: '3:20'
}];

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
        <button className="btn btn-primary">Search</button>
        <SearchResults searchResults={searchResults} />
      </div>
    );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var nodes = this.props.searchResults.map(function(result) {
      return (
        <div className="search_result_item">
          <img src={result.icon} className="search_result_icon" />
          <div className="search_result_info">
            <div className="search_result_title">{result.title}</div>
            <div className="search_result_subinfo">{result.artist} - {result.album}</div>
          </div>
          <div className="search_result_duration">{result.duration}</div>
        </div>
      );
    });
    return (
      <div className="search_results">
        {nodes}
      </div>
    );
  }
});

var Play = React.createClass({
  render: function() {
    return (
      <div className="play_container">
      </div>
    );
  }
});

start();