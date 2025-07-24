/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import './stylex.css';
import * as stylex from '@stylexjs/stylex';
import { dependencyStyles } from './dependency-styles.js';

const styles = stylex.create({
  app: {
    fontFamily: 'system-ui, sans-serif',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },

  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#333',
  },

  description: {
    marginBottom: '2rem',
    lineHeight: '1.5',
    color: '#666',
  },
});

function createApp() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div ${stylex.props(styles.app)}>
      <h1 ${stylex.props(styles.title)}>StyleX + Vite Example</h1>
      <p ${stylex.props(styles.description)}>
        This example demonstrates StyleX working with Vite, including styles
        from simulated dependencies that would normally cause runtime errors.
      </p>
      
      <div ${stylex.props(dependencyStyles.card)}>
        <h3>Dependency Styles Working!</h3>
        <p>This card uses styles from a simulated dependency module.</p>
        <button ${stylex.props(dependencyStyles.button)}>
          Hover me!
        </button>
      </div>
      
      <div ${stylex.props(dependencyStyles.card)}>
        <h3>Success! 🎉</h3>
        <p>
          The StyleX Vite plugin correctly transformed styles from dependencies,
          preventing runtime errors and generating proper CSS.
        </p>
      </div>
    </div>
  `;
}

createApp();
