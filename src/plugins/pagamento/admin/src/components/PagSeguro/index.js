/*
 *
 * PayPall
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
const GatewayEdit = ({gateway}) => {
  const [token, setToken] = useState(gateway.token);
  const [email, setEmail] = useState(gateway.email);


  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  const routeChange = (path) =>{ 
    history.push(path);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    gateway['token'] = token;
    gateway['email'] = email;
    gateway['ativado'] = true;
    gatewayRequests.updateGateway(gateway.id, gateway).then(res => {
      routeChange(`/plugins/${pluginId}`);
    }).catch(function (error) {
      setVisible(true);
      setError(error);
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
          <GridItem padding={1} col={3} s={6} xs={12}>
            <Field name="token" required>
                <FieldLabel>Token</FieldLabel>
                <FieldInput type="text" value={token} onChange={(event) =>setToken(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={3} s={6} xs={12}>
            <Field name="email" required>
                <FieldLabel>Email</FieldLabel>
                <FieldInput type="text" value={email} onChange={(event) =>setEmail(event.target.value)} required/>
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
