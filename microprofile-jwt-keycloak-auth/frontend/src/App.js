import React, { Component } from 'react';
import { Button, Container, Header, Icon, Message, Grid } from 'semantic-ui-react';
import Keycloak from 'keycloak-js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false };
  }

  login = () => {
    const keycloak = Keycloak({
      realm: "MicroProfile",
      url: "http://localhost:8888/auth",
      clientId: "react-webapp"
    });

    keycloak.init({ onLoad: 'login-required' }).success(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated });
    }).error(err => {
      console.log(err);
    });
  }

  logout = () => {
    if (this.state.authenticated) {
      this.state.keycloak.logout();
    }
  }

  decodeJWT = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.stringify(JSON.parse(window.atob(base64)), null, 4);
  }

  render() {

    return (
      <Container>
        <br />
        <Header as='h2' icon textAlign='center'>
          <Icon name='user secret' />
          MicroProfile JWT with Keycloak
         <Header.Subheader>Simple protoype with React + Keycloak and MicroProfile/Jakarta EE</Header.Subheader>
        </Header>
        <Grid centered columns={2}>
          <Grid.Column>
            {this.state.authenticated ?
              <Message
                positive
                icon='check'
                header='You are currently logged in'
                content='Try to access the REST API and get the secured message.'
              /> :
              <Message
                negative
                icon='times'
                header='You are currently not logged in'
                content='Use the login button to authenticate with Keycloak.'
              />}
          </Grid.Column>
        </Grid>

        <Grid centered columns={2}>
          <Grid.Column textAlign='center'>
            <Button onClick={this.login} positive disabled={this.state.authenticated}>Login</Button>
            <Button onClick={this.logout} negative disabled={!this.state.authenticated}>Logout</Button>
          </Grid.Column>
        </Grid>

        <Grid centered columns={2}>
          <Grid.Column textAlign='center'>
            <Header as='h2'>
              Access MicroProfile REST API
            </Header>
            <Button onClick={this.accessRestApi}>Access REST</Button>

          </Grid.Column>
        </Grid>

        <Grid centered columns={2}>
          <Grid.Column>
            <Header as='h2' textAlign='center'>
              Your decoded JWT token
            </Header>
            <Container text>
              <pre>
                {this.state.keycloak ? this.decodeJWT(this.state.keycloak.token) : 'n.A.'}
              </pre>
            </Container >
          </Grid.Column>
        </Grid>

      </Container>
    );
  }
}

export default App;