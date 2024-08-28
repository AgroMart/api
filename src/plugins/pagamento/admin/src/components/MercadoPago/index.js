/*
 *
 * MercadoPago
 *
 */

import React, { useState } from 'react';

import { useHistory } from "react-router-dom";

import { Alert } from '@strapi/design-system';
import { Grid, GridItem } from '@strapi/design-system';
import { Box } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';
import { Field, FieldLabel, FieldInput } from '@strapi/design-system';
import { Button } from '@strapi/design-system';

import pluginId from '../../pluginId';
import './index.css'


import gatewayRequests from '../../api/gateway';
const MercadoPago = ({gateway}) => {
  const [client_id, setClientID] = useState(gateway.client_id);
  const [client_secret, setClientSecret] = useState(gateway.client_secret);
  const [token, setToken] = useState(gateway.token);

  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);

  const history = useHistory();

  const routeChange = (path) =>{ 
    history.push(path);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    gateway['client_id'] = client_id;
    gateway['client_secret'] = client_secret;
    gateway['token'] = token;
    gateway['ativado'] = true;
    gatewayRequests.updateGateway(gateway.id, gateway).then(res => {
      routeChange(`/plugins/${pluginId}`);
    }).catch(function (error) {
      setVisible(true);
      setError(error.response.data.error);
    });
  }

  return (
    <Box padding={8} background="neutral100" max>
      {visible ? <Alert title="Error ao editar valores!" variant="danger">
        {error}
      </Alert> : null}
      <Box padding={4} >
        <Typography variant="alpha">{gateway.nome}</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid gap={{
          desktop: 5,
          tablet: 2,
          mobile: 1
        }} >
          <GridItem padding={1} col={6} s={12}>
            <Field name="token" required>
                <FieldLabel>Token</FieldLabel>
                <FieldInput type="text" value={token} onChange={(event) =>setToken(event.target.value)} required/>
            </Field>
          </GridItem>
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

export default MercadoPago;
