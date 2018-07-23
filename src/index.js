import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Title extends React.Component {
  render() {
    return <h1>{this.props.title}</h1>
  }
}

class Content extends React.Component {
  
  constructor(props) {
    super(props);
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}

class Button extends React.Component {

    constructor(props) {
        super(props);
        this.count = 0;
        this.state = {
          input1: 0,
          input2: 0
        }
        // this.click = this.click.bind(this);
    }
    click (){
        this.setState({input1: this.state.input1 + 1});
    }
    render() {
      console.log(1);
        return (
            <Content>
              {/* <h1>{this.state.input1}</h1>
              <h1>{this.state.input2}</h1> */}
                <Title title={this.state.input1} />
                <Title title={this.state.input2} />
              { this.props.divText }
                <input name={this.props.inputName} className={this.props.classNameInp} />
                <button type="submit" onClick={()=> {this.click();}}>{ this.props.label }</button>
            </Content>
        );
    }
}

ReactDOM.render(<Button classNameInp="input" label="Carregue-me" inputName="q" divText="Enter input and click Search"  />, document.getElementById('mountNode'));