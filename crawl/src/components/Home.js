import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalImage from 'react-modal-image'

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

  reprocesData = e => {
    e.preventDefault();
    this.setState({ images: [], urls: [], web_url: e.target.href, depth: "" })
    this.handleSubmit(e);
  };

  resetData() {
    this.setState({ images: [], urls: [] })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.resetData();
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
      <div className="offset-sm-1 col-sm-10">
        <form   onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="web_url">Enter website url (<i>ie. https://www.amazon.in)</i></label>
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
          <button type="submit" className="btn btn-primary">Get Data</button>
        </form>

        <hr />
        <div className="row">
          <ul className="hide-bullets">
            {this.state.images.map(el => (
              <li className="col-sm-3" key={el}>
                <ModalImage
                  small={el}
                  large={el}
                  alt={el}
                />
              </li>
            ))}
          </ul>
        </div>

        <hr />
        <div className="row">
          <ul className="hide-bullets">
            {this.state.urls.map(el => (
              <li className="col-sm-10" key={el}>
                <a href={el} title="Click to get the data from this URL" onClick={this.reprocesData} className="thumbnail" target="_blank">
                  {el}
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