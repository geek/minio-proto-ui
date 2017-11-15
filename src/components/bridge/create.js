import React from 'react';
import ReactJson from 'react-json-view';

export default ({ bridge, packages, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <ReactJson src={{ bridge, packages }} />
  </form>
);
