import 'index.css';

import { Container, ThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'context/SnakbarContext';
import React from 'react';
import ReactDOM from 'react-dom';
import { ModalProvider } from 'react-modal-hook';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import theme from 'theme';

import Routing from './Routing';
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <ModalProvider>
          <Container maxWidth='md'>
            <Router>
              <Switch>
                <Routing />
              </Switch>
            </Router>
          </Container>
        </ModalProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
