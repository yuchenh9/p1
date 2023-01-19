
import React from "react";
import ReactDOM from "react-dom";
import shortid from "shortid";

class AppComponent extends React.Component {
  state = {
    items: []
  };

  render() {
    console.log(this.state.items);
    return (
      <ParentComponent addChild={this.onAddChild}>
        {this.state.items.map(item => (
          <ChildComponent
            key={item.id}
            item={item}
            remove={this.onRemoveChild}
          />
        ))}
      </ParentComponent>
    );
  }

  onRemoveChild = item => {
    console.log(item);
    this.setState(prev => ({
      items: prev.items.filter(prevItem => prevItem.id !== item.id)
    }));
  };

  onAddChild = () => {
    this.setState(prev => ({
      items: [...prev.items, { id: shortid.generate() }]
    }));
  };
}

// ParentComponent will be in Main.js
const ParentComponent = props => (
  <div className="card calculator">
    
    <div id="children-pane">{props.children}</div>
    <p>
      <button onClick={props.addChild}>Add Child Component</button>
    </p>
  </div>
);

// ChildComponent will be Quote.js
const ChildComponent = props => {
  return (
    <div>
      {`Child  ${props.item.id}  `}
      <button onClick={() => props.remove(props.item)}>x</button>
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<AppComponent />, rootElement);
