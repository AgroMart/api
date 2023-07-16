/*
 *
 * GatewayCustom
 *
 */

import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { Grid, GridItem } from "@strapi/design-system";
import { Box } from "@strapi/design-system";
import { Field, FieldLabel, FieldInput } from "@strapi/design-system";
import { Button } from "@strapi/design-system";

import pluginId from "../../pluginId";
import "./index.css";

import gatewayRequests from "../../api/gateway";
import { Plus, Trash } from "@strapi/icons";
const GatewayCustom = ({ gateway }) => {
  const [nome, setNome] = useState(gateway.nome);
  const [token, setToken] = useState(gateway.token);
  const [pagamento_url, setPagamentoURL] = useState(gateway.pagamento_url);
  const [pagamento_method, setPagamentoMethod] = useState(
    gateway.pagamento_method
  );
  const [pagamento_dados, setPagamentoDados] = useState(
    gateway.pagamento_dados
  );
  const [pagamento_response, setPagamentoResponse] = useState(
    gateway.pagamento_response
  );
  const [pagamento_params, setPagamentoParams] = useState(
    gateway.pagamento_params
  );
  const [requisitionFields, setRequisitionFields] = useState([]);
  const [paramsFields, setParamsFields] = useState([]);

  const handleAddParamField = () => {
    setParamsFields([...paramsFields, { variable: "", systemVariable: "" }]);
  };
  const handleAddReqField = () => {
    setRequisitionFields([
      ...requisitionFields,
      { variable: "", systemVariable: "" },
    ]);
  };

  const handleParamsFieldChange = (index, fieldKey, value) => {
    const updatedFields = [...paramsFields];
    updatedFields[index][fieldKey] = value;
    setParamsFields(updatedFields);
  };
  const handleReqFieldChange = (index, fieldKey, value) => {
    const updatedFields = [...requisitionFields];
    updatedFields[index][fieldKey] = value;
    setRequisitionFields(updatedFields);
  };

  function handleGenerateParamsJson() {
    const json = {};
    paramsFields.forEach((field) => {
      let temp = field.systemVariable;
      let data;
      try {
        data = JSON.parse(temp);
      } catch (error) {
        data = temp;
      }

      json[field.variable] = data;
    });
    const str = JSON.stringify(json);
    return str;
  }

  function handleGenerateReqJson() {
    const json = {};
    requisitionFields.forEach((field) => {
      let temp = field.systemVariable;
      let data;
      try {
        data = JSON.parse(temp);
      } catch (error) {
        console.log("error", error);
        data = temp;
      }
      console.log("data", data);
      json[field.variable] = data;
    });
    const str = JSON.stringify(json);
    return str;
  }

  const handleRemoveReqField = (index) => {
    const updatedFields = [...requisitionFields];
    updatedFields.splice(index, 1);
    setRequisitionFields(updatedFields);
  };
  const handleRemoveParamsField = (index) => {
    const updatedFields = [...paramsFields];
    updatedFields.splice(index, 1);
    setParamsFields(updatedFields);
  };

  const history = useHistory();

  const routeChange = (path) => {
    history.push(path);
  };
  const loadReqDataFields = () => {
    const savedReq = pagamento_dados;
    return savedReq ? JSON.parse(savedReq) : [];
  };
  const loadParamsFields = () => {
    const savedParams = pagamento_params;
    return savedParams ? JSON.parse(savedParams) : [];
  };

  function handleLoadParamField(fields) {
    setParamsFields([...paramsFields, ...fields]);
  }
  function handleLoadReqField(fields) {
    setRequisitionFields([...requisitionFields, ...fields]);
  }

  useEffect(() => {
    const saveReqData = loadReqDataFields();
    const savedParams = loadParamsFields();
    if (savedParams) {
      const paramsArray = Object.entries(savedParams).map(([key, value]) => ({
        variable: key,
        systemVariable: JSON.stringify(value),
      }));
      handleLoadParamField(paramsArray);
    }
    if (saveReqData) {
      const reqArray = Object.entries(saveReqData).map(([key, value]) => ({
        variable: key,
        systemVariable: JSON.stringify(value),
      }));
      handleLoadReqField(reqArray);
    }
  }, []);

  const handleSubmit = (event) => {
    console.log(nome);
    console.log(pagamento_params);
    event.preventDefault();
    gateway["nome"] = nome;
    gateway["token"] = token;
    gateway["pagamento_url"] = pagamento_url;
    gateway["pagamento_method"] = pagamento_method;
    gateway["pagamento_dados"] = handleGenerateReqJson();
    gateway["pagamento_response"] = pagamento_response;
    gateway["pagamento_params"] = handleGenerateParamsJson();
    gateway["ativado"] = true;
    if (gateway.id > 0) {
      gatewayRequests.updateGateway(gateway.id, gateway).then((res) => {
        routeChange(`/plugins/${pluginId}`);
      });
    } else {
      gatewayRequests.createGateway(gateway).then((res) => {
        routeChange(`/plugins/${pluginId}`);
      });
    }
  };

  return (
    <Box padding={8} max>
      <form onSubmit={handleSubmit}>
        <Grid
          gap={{
            desktop: 5,
            tablet: 2,
            mobile: 1,
          }}
        >
          <GridItem padding={1} col={6} s={12}>
            <Field name="nome" required>
              <FieldLabel>Nome</FieldLabel>
              <FieldInput
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </Field>
          </GridItem>
          <GridItem padding={1} col={6} s={12}>
            <Field name="token" required>
              <FieldLabel>Token</FieldLabel>
              <FieldInput
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                required
              />
            </Field>
          </GridItem>
          <GridItem padding={1} col={4} s={6} xs={12}>
            <Field name="pagamento_url" required>
              <FieldLabel>Url de criação de pagamento</FieldLabel>
              <FieldInput
                type="text"
                value={pagamento_url}
                onChange={(event) => setPagamentoURL(event.target.value)}
                required
              />
            </Field>
          </GridItem>
          <GridItem padding={1} col={4} s={6} xs={12}>
            <Field name="pagamento_method" required>
              <FieldLabel>Método da url de criação de pagamento</FieldLabel>
              <FieldInput
                type="text"
                value={pagamento_method}
                onChange={(event) => setPagamentoMethod(event.target.value)}
                required
              />
            </Field>
          </GridItem>
          <GridItem padding={1} col={4} s={6} xs={12}>
            <Field name="pagamento_response" required>
              <FieldLabel>Chave da resposta esperada</FieldLabel>
              <FieldInput
                type="text"
                value={pagamento_response}
                onChange={(event) => setPagamentoResponse(event.target.value)}
                required
              />
            </Field>
          </GridItem>
          <GridItem padding={1} col={12} xs={12}>
            <Field name="pagamento_params" required>
              <FieldLabel>Parametros da requisição</FieldLabel>
              <div>
                {paramsFields.map((field, index) => (
                  <Grid col={12} key={index} className="key-value-grid">
                    <FieldInput
                      placeholder="Chave"
                      className="key-field"
                      value={field.variable}
                      size="M"
                      onChange={(e) =>
                        handleParamsFieldChange(
                          index,
                          "variable",
                          e.target.value
                        )
                      }
                      required
                    />
                    <div className="centered spacer">=</div>
                    <FieldInput
                      size="M"
                      placeholder="Valor"
                      className="value-field"
                      value={field.systemVariable}
                      onChange={(e) =>
                        handleParamsFieldChange(
                          index,
                          "systemVariable",
                          e.target.value
                        )
                      }
                      required
                    />
                    <Button
                      padding={5}
                      className="centered button-padding"
                      size="G"
                      onClick={() => handleRemoveParamsField(index)}
                      variant="danger"
                    >
                      <Trash />
                    </Button>
                  </Grid>
                ))}
                <Button
                  padding={3}
                  onClick={handleAddParamField}
                  className="centered add-button-width"
                  startIcon={<Plus />}
                >
                  Adicionar Campo
                </Button>
              </div>
            </Field>
          </GridItem>
          <GridItem padding={1} col={12} xs={12}>
            <Field name="pagamento_dados" required>
              <FieldLabel>Dados da requisição</FieldLabel>
              <div>
                {requisitionFields.map((field, index) => (
                  <Grid col={12} key={index} className="key-value-grid">
                    <FieldInput
                      placeholder="Chave"
                      className="key-field"
                      value={field.variable}
                      size="M"
                      onChange={(e) =>
                        handleReqFieldChange(index, "variable", e.target.value)
                      }
                      required
                    />
                    <div className="centered spacer">=</div>
                    <FieldInput
                      size="M"
                      placeholder="Valor"
                      className="value-field"
                      value={field.systemVariable}
                      onChange={(e) =>
                        handleReqFieldChange(
                          index,
                          "systemVariable",
                          e.target.value
                        )
                      }
                      required
                    />
                    <Button
                      padding={5}
                      className="centered button-padding"
                      size="G"
                      onClick={() => handleRemoveReqField(index)}
                      variant="danger"
                    >
                      <Trash />
                    </Button>
                  </Grid>
                ))}
                <Button
                  padding={3}
                  onClick={handleAddReqField}
                  className="centered add-button-width"
                  startIcon={<Plus />}
                >
                  Adicionar Campo
                </Button>
              </div>
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
