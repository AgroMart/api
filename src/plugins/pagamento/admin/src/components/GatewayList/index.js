/*
 *
 * GatewayList
 *
 */

import React from 'react';

import { useHistory } from "react-router-dom";

import { Box } from '@strapi/design-system';
import { Table, Thead, Tbody, Tr, Td, Th, TFooter } from '@strapi/design-system';
import { ToggleInput } from '@strapi/design-system';
import { Plus } from '@strapi/icons';

import gatewayRequests from '../../api/gateway';
import pluginId from '../../pluginId';


const GatewayList = ({gatewayList}) => {
  const history = useHistory();

  const routeChange = (path) =>{ 
    history.push(path);
  }

  const toggleGatewayUpdate = (item) => {
    if(item.ativado == false){
      routeChange(`/plugins/${pluginId}/gateway/${item.id}`);
    } else {
      item.ativado = false;
      gatewayRequests.updateGateway(item.id, item);
      routeChange(`/plugins/${pluginId}`);
    }
  };
  return (
    <Box padding={8} background="neutral100">
      <Table footer={<a href={`/admin/plugins/${pluginId}/gateway/create`}><TFooter  icon={<Plus />}> Adicione um novo Gateway</TFooter></a>}>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
        {gatewayList.map((item, index) => (
            <Tr key={index}>
              <Td>{item.nome}</Td>
              <Td>
                <ToggleInput onLabel="Ativado" offLabel="Desativado" checked={item.ativado} onChange={() => toggleGatewayUpdate(item)}/>
              </Td>
            </Tr>
            ))}
        </Tbody>
      </Table>
      </Box>
  );
};

export default GatewayList;
