/*
 *
 * GatewayUpdate
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import { Link } from '@strapi/design-system/Link';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import { LoadingIndicatorPage } from '@strapi/helper-plugin';

import GatewayCustom from '../../components/GatewayCustom';
import PayPal from '../../components/PayPal';
import PagSeguro from '../../components/PagSeguro';
import MercadoPago from '../../components/MercadoPago';
import gatewayRequests from '../../api/gateway';
import pluginId from '../../pluginId';

const GatewayUpdate = () => {
  const { id } = useParams();

  const { formatMessage } = useIntl();

  const [isLoading, setIsLoading] = useState(true);
  const [gateway, setGateway] = useState(null);

  useEffect(() => {
    gatewayRequests.getGateway(id).then(res => {
      setGateway(res.data);
      setIsLoading(false);
    });
  }, [setGateway]);

  if (isLoading) return <LoadingIndicatorPage />;

  let Form;
  if(gateway.nome == "PagSeguro"){
    Form = <PagSeguro gateway={gateway}/>
  } else if (gateway.nome == "Mercado Pago"){
    Form = <MercadoPago gateway={gateway}/>
  } else if (gateway.nome == "PayPal" ) {
    Form = <PayPal gateway={gateway}/>
  } else {
    Form = <GatewayCustom gateway={gateway}/>
  }

  return (

    <>
      <BaseHeaderLayout
        title={pluginId.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}
        subtitle="Página de edição para ativação de um modo de pagamento"
        as="h2"
        navigationAction={
          <Link startIcon={<ArrowLeft />} to="/plugins/pagamento/">
            {formatMessage({
              id: 'app.components.HeaderLayout.link.go-back',
              defaultMessage: 'Back',
            })}
          </Link>
        }
      />
      {Form}
    </>
  );
};

export default memo(GatewayUpdate);
