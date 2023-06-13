/*
 *
 * HomePage
 *
 */
import React, { memo, useState, useEffect } from 'react';
import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import gatewayRequests from '../../api/gateway';
import pagamentoRequests from '../../api/pagamento';
import GatewayList  from '../../components/GatewayList';
import PagamentoList  from '../../components/PagamentoList';
import { LoadingIndicatorPage } from '@strapi/helper-plugin';
import pluginPkg from '../../../../package.json';
import pluginId from '../../pluginId';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gatewayList, setGatewayList] = useState(null);
  const [pagamentoList, setPagamentoList] = useState(null);

  useEffect(() => {
    gatewayRequests.getGatewayList().then(res => {
      setGatewayList(res.data);
      pagamentoRequests.getPagamentoList().then(res => {
        setPagamentoList(res.data);
        setIsLoading(false);
      });
    });
    
  }, [setGatewayList]);

  if (isLoading) return <LoadingIndicatorPage />;
  return (
    <>
      <BaseHeaderLayout
        title={pluginId.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
        subtitle={pluginPkg.strapi.description}
        as="h2"
      />
      <GatewayList gatewayList={gatewayList}/>
      <PagamentoList pagamentoList={pagamentoList}/>
    </>
  );
};

export default memo(HomePage);
