import axiosInstance from "./axios.config";

export const getAllYeuCau = async () => {
  const response = await axiosInstance.get("/YeuCauDichVu/cua-toi");
  return response.data;
};
