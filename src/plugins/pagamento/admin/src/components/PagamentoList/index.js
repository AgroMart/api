/*
 *
 * PagamentoList
 *
 */

import React from 'react';

import { Grid, GridItem } from '@strapi/design-system';
import { Box } from '@strapi/design-system';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system';
import { FieldInput } from '@strapi/design-system';

import GatewayLink from '../GatewayLink';

const PagamentoList = ({pagamentoList}) => {

  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState("asc");

  const handleSearch = (event) => {
    let filter = event.target.value.toUpperCase();
    let table = document.getElementById("pagamentoTable");
    let tr = table.getElementsByTagName("tr");
    for (var i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        let txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  const handleSort = (n) => {
    const table = document.getElementById("pagamentoTable");
    const rows = Array.from(table.rows).slice(1);
    const sortedRows = [...rows];

    let newSortDirection = "asc";

    if (sortColumn === n && sortDirection === "asc") {
      sortedRows.reverse();
      newSortDirection = "desc";
    } else {
      sortedRows.sort((a, b) => {
        const x = a.getElementsByTagName("TD")[n].innerHTML.toLowerCase();
        const y = b.getElementsByTagName("TD")[n].innerHTML.toLowerCase();

        if (x < y) return -1;
        if (x > y) return 1;
        return 0;
      });
    }

    setSortColumn(n);
    setSortDirection(newSortDirection);

    sortedRows.forEach((row) => table.appendChild(row));
  };

  return (
    <Box padding={8} background="neutral100">
      <Grid gap={{
          desktop: 5,
          tablet: 2,
          mobile: 1
        }} >
        <GridItem col={6} s={12}>
          <FieldInput type="text" placeholder="Procure o cliente"  onChange={(event) =>handleSearch(event)}/>
        </GridItem>
        <GridItem col={12} xs={12}>
          <Table id="pagamentoTable">
            <Thead>
              <Tr>
                <Th onClick={(event) =>handleSort(0)}>Usuário {sortColumn === 0 && (sortDirection === "asc" ? "↑" : "↓")} </Th>
                <Th>Descrição</Th>
                <Th onClick={(event) =>handleSort(2)}>Valor {sortColumn === 2 && (sortDirection === "asc" ? "↑" : "↓")}</Th>
                <Th>Gerar Link</Th>
              </Tr>
            </Thead>
            <Tbody>
            {pagamentoList.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.user.username}</Td>
                  <Td>{item.itens.map(i => <p> Produto: {i.produto_avulso.nome||i.plano.nome}, quantidade: {i.quantidade}, valor: {i.valor}</p> )}</Td>
                  <Td>{item.itens.reduce((total, item) => total + (item.quantidade * item.valor), 0)}</Td>
                  <Td><GatewayLink extrato={item}/></Td>
                </Tr>
                ))}
            </Tbody>
          </Table>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default PagamentoList;
