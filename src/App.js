import React, {Component} from "react";
import { PieChart } from "react-easy-chart";

const COD_API =
  "https://data.cambridgema.gov/api/id/m4i2-83v6.json?$query=SELECT%20%60violation_description%60%20AS%20__dimension_alias__%2C%20COUNT(*)%20AS%20__measure_alias__%20%20GROUP%20BY%20%60violation_description%60%20ORDER%20BY%20__measure_alias__%20DESC%20NULL%20LAST%20LIMIT%201001&$$read_from_nbe=true&$$version=2.1";

class App extends Component {
  state = {
    isDone: false,
    data: []
  };

  // get Random Color for pie Chart slices
  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color; // returning a random color
  }

  componentDidMount() {
    let array = []; // creating an array to storage the fetched data
    // fetch pie Chart data
    fetch(COD_API)
      .then(res => {
        return res.json();
      })
      .then(res => {
        res.forEach(data => {
          array.push({
            key: data.__dimension_alias__,
            value: data.__measure_alias__,
            color: this.getRandomColor()
          });
        });
        this.setState({
          isDone: true,
          data: array
        });
      })
      .catch(error => {
        this.setState({
          isDone: false
        });
      });
  }

  // method to show the label when you move the mouse over it
  mouseOverHandler = (d, e) => {
    this.setState({
      showToolTip: true,
      top: e.y,
      left: e.x,
      value: d.value,
      key: d.data.key
    });
  };

  // if you move the mouse, it just updates the coordinates
  mouseMoveHandler = e => {
    if (this.state.showToolTip) {
      this.setState({ top: e.y, left: e.x });
    }
  };

  mouseOutHandler = () => {
    this.setState({ showToolTip: false });
  };

  createTooltip = () => {
    if (this.state.showToolTip) {
      return (
        <div
          style={{
            position: "absolute",
            left: this.state.left + "px",
            top: this.state.top + "px",
            width: "120px",
            backgroundColor: "black",
            color: "#fff",
            textAlign: "center",
            padding: "5px 0",
            borderRadius: "6px"
          }}
        >
          <p>{this.state.key}</p>
          <p>{Math.round(Number(this.state.value)).toLocaleString()}</p>
        </div>
      );
    }
    return false;
  };

  render() {
    return (
      <div>
        {this.state.isDone ? (
          <div
            style={{
              display: "flex",
              position: "relative"
            }}
          >
            {this.createTooltip()}
            <PieChart
              innerHoleSize="0"
              mouseOverHandler={this.mouseOverHandler}
              mouseOutHandler={this.mouseOutHandler}
              mouseMoveHandler={this.mouseMoveHandler}
              padding={0}
              data={this.state.data}
              styles={{
                ".chart_lines": {
                  strokeWidth: 50
                },
                ".chart_text": {
                  fontFamily: "serif",
                  fontSize: "1.25em",
                  fill: "#333"
                }
              }}
            />
            <div>
              {this.state.data.map((data, index) => (
                <p
                  key={index}
                  style={{
                    margin: 0,
                    fontSize: "14px"
                  }}
                >
                  <span
                    style={{
                      backgroundColor: data.color,
                      display: "inline-block",
                      width: "20px",
                      height: "20px"
                    }}
                  />
                  <span>{data.key}</span>
                </p>
              ))}
            </div>
          </div>
        ) : (
          "No data"
        )}
      </div>
    );
  }
}

export default App;
