import axiosInstance from '../../utils/axiosInstance';

const gatewayRequests = {
  getGatewayList: async () => {
    const data = await axiosInstance.get(`/pagamento/gateway`);
    return data;
  },
  getGateway: async (id) => {
    const data = await axiosInstance.get(`/pagamento/gateway/${id}`);
    return data;
  },
  getGatewayAtivado: async () => {
    const data = await axiosInstance.get(`/pagamento/gateway/ativado`);
    return data;
  },
  updateGateway: async (id, body) => {
    let send = JSON.stringify(body);
    const data = await axiosInstance.put(`/pagamento/gateway/${id}`, send);
    return data;
  },
  createGateway: async (body) => {
    let send = JSON.stringify(body);
    const data = await axiosInstance.post(`/pagamento/gateway/`, send);
    return data;
  },
};
export default gatewayRequests;
