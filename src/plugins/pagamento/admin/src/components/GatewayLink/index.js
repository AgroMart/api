/*
 *
 * GatewayLink
 *
 */

import React, { useState, useEffect } from 'react';


import { Alert } from '@strapi/design-system';
import { LoadingIndicatorPage } from '@strapi/helper-plugin';
import { IconButton } from '@strapi/design-system';
import Duplicate from '@strapi/icons/Duplicate';
import { ModalLayout, ModalBody, ModalHeader, ModalFooter } from '@strapi/design-system';
import { Radio, RadioGroup } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';
import { Button } from '@strapi/design-system';

import gatewayRequests from '../../api/gateway';
import pagamentoRequests from '../../api/gateway';

const GatewayLink = ({extrato}) => {

  const [isLoading, setIsLoading] = useState(true);
  const [gatewayList, setGatewayList] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    gatewayRequests.getGatewayAtivado().then(res => {
      setGatewayList(res.data);
      setIsLoading(false);
      if (res.data.length == 1){
        setSelectedGateway(res.data[0].nome);
      }
    });
    
  }, [setGatewayList]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedGateway(null);
  }
  const handleSelecionado = () => {
    setIsModalVisible(false);
    handleClick();
  }
  const handleClick = () => {
    // if (selectedGateway){
    //   const body = {
    //     gateway: selectedGateway,
    //     extrato: extrato
    //   }
    //   pagamentoRequests.createLink(body).then(async res => {
    //     navigator.clipboard.writeText(res.data).then(() => {
    //       console.log(`Content copied to clipboard ${res.data}`);
    //     },() => {
    //       alert("Link gerado " + res.data);
    //     });
    //   }).catch(function (error) {
    //     alert("Erro: " + error.response.data.error);
    //   });
    // } else {
    //   console.log(gatewayList)
    //   setIsModalVisible(true);
    // }
  }

  if (isLoading) return <LoadingIndicatorPage />;

    return (
        <>
        {isModalVisible && 
          <ModalLayout onClose={() => setIsModalVisible(prev => !prev)}>
            <ModalHeader>
              <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
              Selecione o Gateway
              </Typography>
            </ModalHeader>
            <ModalBody>
            <RadioGroup labelledBy="trophy-champions" onChange={e => setSelectedGateway(e.target.value)} value={selectedGateway} name="meal">
            {gatewayList.map((item) => (
              <Radio value={item.nome}>{item.nome}</Radio>
            ))}
            </RadioGroup> 
              
            </ModalBody>
            <ModalFooter 
              startActions={<Button onClick={() => handleCancel()} variant="tertiary">Cancelar</Button>} 
              endActions={<Button onClick={() => handleSelecionado()}>Selecionar</Button>} 
            />
          </ModalLayout>}
        <IconButton onClick={() => handleClick()} label="Copiar Link" icon={<Duplicate />} />
        </>
      );
}

export default GatewayLink;
