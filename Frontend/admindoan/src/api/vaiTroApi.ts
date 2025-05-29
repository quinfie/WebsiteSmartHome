import axios from "./axios.config";
import { VaiTroDto } from "../types/vaitro";
import { BaseResponse } from "../types/baseResponse";

export const getAllVaiTro = async (): Promise<VaiTroDto[]> => {
  const res = await axios.get<BaseResponse<VaiTroDto[]>>("/api/VaiTro");
  return res.data.data;
};

export const getVaiTroById = async (id: string): Promise<VaiTroDto> => {
  const res = await axios.get<BaseResponse<VaiTroDto>>(`/api/VaiTro/${id}`);
  return res.data.data;
};

export const createVaiTro = async (tenVaiTro: string): Promise<VaiTroDto> => {
  const res = await axios.post<BaseResponse<VaiTroDto>>("/api/VaiTro", tenVaiTro, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data.data;
};

export const updateVaiTro = async (id: string, tenVaiTro: string): Promise<boolean> => {
  const res = await axios.put<BaseResponse<boolean>>(`/api/VaiTro/${id}`, tenVaiTro, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data.data;
};

export const deleteVaiTro = async (id: string): Promise<boolean> => {
  const res = await axios.delete<BaseResponse<boolean>>(`/api/VaiTro/${id}`);
  return res.data.data;
};

export const searchVaiTro = async (keyword: string): Promise<VaiTroDto[]> => {
  const res = await axios.get<BaseResponse<VaiTroDto[]>>(`/api/VaiTro/search?keyword=${keyword}`);
  return res.data.data;
};
