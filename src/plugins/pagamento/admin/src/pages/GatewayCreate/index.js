/*
 *
 * GatewayUpdate
 *
 */

import React, { memo, useState } from 'react';
import { useIntl } from 'react-intl';

import { BaseHeaderLayout } from '@strapi/design-system/Layout';
import { Link } from '@strapi/design-system/Link';
import ArrowLeft from '@strapi/icons/ArrowLeft';

import GatewayCustom from '../../components/GatewayCustom';
import pluginId from '../../pluginId';

const GatewayCreate = () => {

  const { formatMessage } = useIntl();

  const [gateway, setGateway] = useState(null);

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
      <GatewayCustom gateway={gateway}/>
    </>
  );
};

export default memo(GatewayCreate);
