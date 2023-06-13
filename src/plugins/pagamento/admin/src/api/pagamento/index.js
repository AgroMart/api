import axiosInstance from '../../utils/axiosInstance';

const pagamentoRequests = {
  getPagamentoList: async () => {
    const data = await axiosInstance.get(`/pagamento/pagamento`);
    return data;
  },
};
export default pagamentoRequests;
