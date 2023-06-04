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

  const [client_id, setClientID] = useState(gateway.client_id);
  const [client_secret, setClientSecret] = useState(gateway.client_secret);

  const history = useHistory();

  const routeChange = (path) =>{ 
    history.push(path);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    gateway['client_id'] = client_id;
    gateway['client_secret'] = client_secret;
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
            <Field name="client_id" required>
                <FieldLabel>Client ID</FieldLabel>
                <FieldInput type="text" value={client_id} onChange={(event) =>setClientID(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={3} s={6} xs={12}>
            <Field name="client_secret" required>
                <FieldLabel>Client Secret</FieldLabel>
                <FieldInput type="text" value={client_secret} onChange={(event) =>setClientSecret(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={8} xs={12}>
            <Button type="submit">Enviar</Button>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
};

export default GatewayEdit;
