import React from 'react'
import './App.css'
import MainContainer from "./new-components/maincontainer";
import {ApolloProvider} from "@apollo/react-hooks";
import {Helmet} from "react-helmet";

import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://lecshare.api.oimo.ca/dev/query',
});


const App: React.FC = () => {

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Lecshare</title>
        <link href="https://fonts.googleapis.com/css?family=Habibi&display=swap" rel="stylesheet"/>
      </Helmet>
      <ApolloProvider client={client}>
        <MainContainer/>
      </ApolloProvider>
    </div>
  );
}

export default App;
