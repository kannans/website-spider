import React, { Component } from "react";
import PropTypes from "prop-types";
class Home extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired
  };
  state = {
    web_url: "",
    depth: "",
    images: [],
    urls: []
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    const { web_url, depth } = this.state;
    const lead = { web_url, depth };
    const conf = {
      method: "get",
    };
    fetch('/api/grabit?url=' + web_url + '&depth=' + depth, conf).then(response => {
      if (response.status !== 200) {
        return this.setState({ placeholder: "Something went wrong" });
      }
      return response.json();
    })
    .then(data => this.setState({ images: data.images, urls: data.page_urls }));
  };
  render() {
    const { web_url, depth } = this.state;
    return (
      <div className="offset-sm-2 col-sm-10">
        <form   onSubmit={this.handleSubmit}>
          <div class="form-group">
            <label for="web_url">Enter website url (<i>ie. https://www.amazon.in)</i></label>
            <div className="control">
              <input
                className="form-control"
                type="text"
                name="web_url"
                onChange={this.handleChange}
                value={web_url}
                required
              />
            </div>
          </div>
          {/* <div className="form-group">
            <label for="depth">Depth Nodes: </label>
            <div className="control">
              <input
                className="form-control"
                type="text"
                name="depth"
                onChange={this.handleChange}
                value={depth}
              />
            </div>
          </div> */}
          <button type="submit" class="btn btn-primary">Get Images</button>
        </form>

        <hr />
        <div class="row">
          <ul class="hide-bullets">
            {this.state.images.map(el => (
              <li className="col-sm-3" key={el}>
                <a href={el} className="thumbnail" target="_blank" download>
                  <img src={el} alt={el} className="img-thumbnail"/>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default Home;