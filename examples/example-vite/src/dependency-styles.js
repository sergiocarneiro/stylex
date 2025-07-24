/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import stylex from '@stylexjs/stylex';

export const dependencyStyles = stylex.create({
  card: {
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#0056b3',
    },
  },
});
