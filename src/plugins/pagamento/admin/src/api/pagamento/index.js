import axiosInstance from '../../utils/axiosInstance';

const pagamentoRequests = {
  getPagamentoList: async () => {
    const data = await axiosInstance.get(`/pagamento/pagamento`);
    return data;
  },
  createLink: async (body) => {
    let send = JSON.stringify(body);
    const data = await axiosInstance.post(`/pagamento/pagamento/link`, send);
    return data;
  },
};
export default pagamentoRequests;
