import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
import { Container, Message, Form, Input, Button } from "semantic-ui-react";
class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",

    errorMessage: "",
    loadingOnSubmit: false,
    loadingOnclick: false,
  };
  async componentDidMount() {
    this.setState({ errorMessage: "" });
    try {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);

      this.setState({ manager, players, balance });
    } catch (error) {
      this.setState({
        errorMessage: "Refresh the Page. (You need to connect wallet)",
      });
    }
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loadingOnSubmit: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();

      this.setState({
        message: "Waiting on transaction success...",
      });

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });

      this.setState({
        message: "You have been entered!",
      });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loadingOnSubmit: false });
  };

  onClick = async () => {
    this.setState({ loadingOnclick: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();

      this.setState({
        message: "Waiting on transaction success...",
      });

      await lottery.methods.pickWinner().send({
        from: accounts[0],
      });

      this.setState({
        message: "A winner has been picked!",
      });
    } catch (error) {
      console.log(error.message);
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loadingOnclick: false });
  };

  render() {
    return (
      <Container>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        ></link>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>

        <hr />
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <h4>Want to try your luck?</h4>
          <Form.Field>
            <label>Amount of ether to enter</label>
            <Input
              focus
              placeholder="Enter amount..."
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Button primary loading={this.state.loadingOnSubmit}>
            Enter
          </Button>
        </Form>

        <hr />
        <h4>Ready to pick a winner?</h4>
        <Button
          primary
          onClick={this.onClick}
          loading={this.state.loadingOnclick}
        >
          Pick a winner!
        </Button>

        <hr />
        {this.state.errorMessage ? (
          <Message error header="Oops!" content={this.state.errorMessage} />
        ) : (
          <h1>{this.state.message}</h1>
        )}
      </Container>
    );
  }
}
export default App;
