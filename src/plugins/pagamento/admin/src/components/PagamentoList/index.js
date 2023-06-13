/*
 *
 * PagamentoList
 *
 */

import React from 'react';

import { useHistory } from "react-router-dom";

import { Box } from '@strapi/design-system';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system';
import { Checkbox } from '@strapi/design-system';

const PagamentoList = ({pagamentoList}) => {
  const history = useHistory();

  const routeChange = (path) =>{ 
    history.push(path);
  }

  return (
    <Box padding={8} background="neutral100">
      <Table>
        <Thead>
          <Tr>
            <Th>Usuário</Th>
            <Th>Descrição</Th>
            <Th>Valor</Th>
            <Th>Pago</Th>
            <Th>Gerar Link</Th>
          </Tr>
        </Thead>
        <Tbody>
        {pagamentoList.map((item, index) => (
            <Tr key={index}>
              <Td>{item.user.username}</Td>
              <Td>{item.itens}</Td>
              <Td>{item.valor}</Td>
              <Td><Checkbox checked={item.pagamento_realizado}/> </Td>
              <Td>TO DO</Td>
            </Tr>
            ))}
        </Tbody>
      </Table>
      </Box>
  );
};

export default PagamentoList;
