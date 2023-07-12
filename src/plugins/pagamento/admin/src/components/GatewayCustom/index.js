/*
 *
 * GatewayCustom
 *
 */

import React, { useState } from 'react';

import { useHistory } from "react-router-dom";

import { Grid, GridItem } from '@strapi/design-system';
import { Box } from '@strapi/design-system';
import { Field, FieldLabel, FieldInput } from '@strapi/design-system';
import { Textarea } from '@strapi/design-system';
import { Button } from '@strapi/design-system';

import pluginId from '../../pluginId';
import './index.css'


import gatewayRequests from '../../api/gateway';
const GatewayCustom = ({gateway}) => {
  const [nome, setNome] = useState(gateway.nome);
  const [token, setToken] = useState(gateway.token);
  const [pagamento_url, setPagamentoURL] = useState(gateway.pagamento_url);
  const [pagamento_method, setPagamentoMethod] = useState(gateway.pagamento_method);
  const [pagamento_dados, setPagamentoDados] = useState(gateway.pagamento_dados);
  const [pagamento_response, setPagamentoResponse] = useState(gateway.pagamento_response);
  const [pagamento_params, setPagamentoParams] = useState(gateway.pagamento_params);

  const history = useHistory();

  const routeChange = (path) =>{ 
    history.push(path);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    gateway['nome'] = nome;
    gateway['token'] = token;
    gateway['pagamento_url'] = true;
    gateway['pagamento_method'] = pagamento_method;
    gateway['pagamento_dados'] = pagamento_dados;
    gateway['pagamento_response'] = pagamento_response;
    gateway['pagamento_params'] = pagamento_params;
    gateway['ativado'] = true;
    if (gateway.id > 0){
      gatewayRequests.updateGateway(gateway.id, gateway).then(res => {
        routeChange(`/plugins/${pluginId}`);
      });
    } else {
      gatewayRequests.createGateway(gateway).then(res => {
        routeChange(`/plugins/${pluginId}`);
      });
    }
  }

  return (
    <Box padding={8} max>
      <form onSubmit={handleSubmit}>
        <Grid gap={{
          desktop: 5,
          tablet: 2,
          mobile: 1
        }} >
          <GridItem padding={1} col={6} s={12}>
            <Field name="nome" required>
                <FieldLabel>Nome</FieldLabel>
                <FieldInput type="text" value={nome} onChange={(event) =>setNome(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={6} s={12}>
            <Field name="token" required>
                <FieldLabel>Token</FieldLabel>
                <FieldInput type="text" value={token} onChange={(event) =>setToken(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={3} s={6} xs={12}>
            <Field name="pagamento_url" required>
                <FieldLabel>Url de criação de pagamento</FieldLabel>
                <FieldInput type="text" value={pagamento_url} onChange={(event) =>setPagamentoURL(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={3} s={6} xs={12}>
            <Field name="pagamento_method" required>
                <FieldLabel>Método da url de criação de pagamento</FieldLabel>
                <FieldInput type="text" value={pagamento_method} onChange={(event) =>setPagamentoMethod(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={3} s={6} xs={12}>
            <Field name="pagamento_response" required>
                <FieldLabel>Chave da resposta esperada</FieldLabel>
                <FieldInput type="text" value={pagamento_response} onChange={(event) =>setPagamentoResponse(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={3} s={6} xs={12}>
          <Field name="pagamento_params" required>
                <FieldLabel>Parametros da requisição</FieldLabel>
                <FieldInput type="text" value={pagamento_params} onChange={(event) =>setPagamentoParams(event.target.value)} required/>
            </Field>
          </GridItem>
          <GridItem padding={1} col={8} xs={12}>
            <Field name="pagamento_dados" required>
              <FieldLabel>Dados da requisição</FieldLabel>
              <Textarea value={pagamento_dados} onChange={(event) =>setPagamentoDados(event.target.value)} required/>
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

export default GatewayCustom;
