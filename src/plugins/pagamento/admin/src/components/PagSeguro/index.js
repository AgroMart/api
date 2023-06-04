/*
 *
 * PayPall
 *
 */

import React, { useState } from 'react';

import { useHistory } from "react-router-dom";

import { Grid, GridItem } from '@strapi/design-system';
import { Box } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';
import { Field, FieldLabel, FieldInput } from '@strapi/design-system';
import { Button } from '@strapi/design-system';

import pluginId from '../../pluginId';
import './index.css'


import gatewayRequests from '../../api/gateway';
const GatewayEdit = ({gateway}) => {
  console.log(gateway)

  const [token, setToken] = useState(gateway.token);

  const history = useHistory();

  const routeChange = (path) =>{ 
    history.push(path);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    gateway['token'] = token;
    gateway['ativado'] = true;
    gatewayRequests.updateGateway(gateway.id, gateway).then(res => {
      routeChange(`/plugins/${pluginId}`);
    });
  }

  return (
    <Box padding={8} background="neutral100" max>
      <Box padding={4} >
        <Typography variant="alpha">{gateway.nome}</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid gap={{
          desktop: 5,
          tablet: 2,
          mobile: 1
        }} >
          <GridItem padding={1} col={3} s={6} xs={12}>
            <Field name="token" required>
                <FieldLabel>Token</FieldLabel>
                <FieldInput type="text" value={token} onChange={(event) =>setToken(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={5} col={2} xs={12}>
            <Button type="submit">Enviar</Button>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
};

export default GatewayEdit;
