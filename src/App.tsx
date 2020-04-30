import React from 'react'
import './App.css'
import MainContainer from "./new-components/maincontainer";
import {Helmet} from "react-helmet";
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {ApolloProvider} from "@apollo/react-hooks";

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'https://dev.oimo.ca/lecshare/query/'
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link
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
