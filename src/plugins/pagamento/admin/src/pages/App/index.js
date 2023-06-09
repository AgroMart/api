/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import GatewayUpdate from '../GatewayUpdate';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route path={`/plugins/${pluginId}/gateway/:id`} component={GatewayUpdate} exact />
        <Route path={`/plugins/${pluginId}/gateway/create`} component={GatewayUpdate} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
