import App from '@components/App/App';
import React from 'react';
import { resetServerContext } from 'react-beautiful-dnd';
import { GetServerSideProps } from 'next';

function HomePage() {
  resetServerContext();
  return <App />;
}

export default HomePage;
