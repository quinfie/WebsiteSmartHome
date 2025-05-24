import { createContext, useContext } from "react";
import { yeucaudichvuApi } from "../api/yeucaudichvu";
import {
    YeuCauDichVuDto,
    CreateYeuCauDichVuDto,
    UpdateChiPhiYeuCauDto,
    YeuCauDichVuKhachHangDto
} from "../types/yeucaudichvu";

interface YeuCauDichVuContextType {
    taoYeuCau: (dto: CreateYeuCauDichVuDto) => Promise<YeuCauDichVuDto>;
    getYeuCauCuaToi: () => Promise<YeuCauDichVuKhachHangDto[]>;
    getByKhachHang: (khachHangId: string) => Promise<YeuCauDichVuKhachHangDto[]>;
    getById: (id: string) => Promise<YeuCauDichVuDto>;
    updateTrangThai: (id: string, trangThai: string) => Promise<YeuCauDichVuDto>;
    updateChiPhi: (id: string, chiPhi: number) => Promise<YeuCauDichVuDto>;
    updateNgayXuLy: (id: string, ngayXuLy: Date) => Promise<YeuCauDichVuDto>;
    huyYeuCau: (id: string) => Promise<YeuCauDichVuDto>;
    xacNhanYeuCau: (id: string) => Promise<YeuCauDichVuDto>;
    getAllYeuCau: (trangThai?: string, loaiDichVu?: string) => Promise<YeuCauDichVuDto[]>;
    getYeuCauChuaPhanCong: () => Promise<YeuCauDichVuDto[]>;
    getYeuCauTheoKyThuatVien: (kyThuatVienId: string) => Promise<YeuCauDichVuDto[]>;
    countYeuCauTheoTrangThai: (trangThai: string) => Promise<number>;
    tinhTongChiPhi: (tuNgay?: Date, denNgay?: Date) => Promise<number>;
}

const YeuCauDichVuContext = createContext<YeuCauDichVuContextType | undefined>(undefined);

export const YeuCauDichVuProvider = ({ children }: { children: React.ReactNode }) => {
    const taoYeuCau = async (dto: CreateYeuCauDichVuDto) => {
        return await yeucaudichvuApi.taoYeuCau(dto);
    };

    const getYeuCauCuaToi = async () => {
        return await yeucaudichvuApi.getYeuCauCuaToi();
    };

    const getByKhachHang = async (khachHangId: string) => {
        return await yeucaudichvuApi.getByKhachHang(khachHangId);
    };

    const getById = async (id: string) => {
        return await yeucaudichvuApi.getById(id);
    };

    const updateTrangThai = async (id: string, trangThai: string) => {
        return await yeucaudichvuApi.updateTrangThai(id, trangThai);
    };

    const updateChiPhi = async (id: string, chiPhi: number) => {
        return await yeucaudichvuApi.updateChiPhi(id, chiPhi);
    };

    const updateNgayXuLy = async (id: string, ngayXuLy: Date) => {
        return await yeucaudichvuApi.updateNgayXuLy(id, ngayXuLy);
    };

    const huyYeuCau = async (id: string) => {
        return await yeucaudichvuApi.huyYeuCau(id);
    };

    const xacNhanYeuCau = async (id: string) => {
        return await yeucaudichvuApi.xacNhanYeuCau(id);
    };

    const getAllYeuCau = async (trangThai?: string, loaiDichVu?: string) => {
        return await yeucaudichvuApi.getAllYeuCau(trangThai, loaiDichVu);
    };

    const getYeuCauChuaPhanCong = async () => {
        return await yeucaudichvuApi.getYeuCauChuaPhanCong();
    };

    const getYeuCauTheoKyThuatVien = async (kyThuatVienId: string) => {
        return await yeucaudichvuApi.getYeuCauTheoKyThuatVien(kyThuatVienId);
    };

    const countYeuCauTheoTrangThai = async (trangThai: string) => {
        return await yeucaudichvuApi.countYeuCauTheoTrangThai(trangThai);
    };

    const tinhTongChiPhi = async (tuNgay?: Date, denNgay?: Date) => {
        return await yeucaudichvuApi.tinhTongChiPhi(tuNgay, denNgay);
    };

    return (
        <YeuCauDichVuContext.Provider value={{
            taoYeuCau,
            getYeuCauCuaToi,
            getByKhachHang,
            getById,
            updateTrangThai,
            updateChiPhi,
            updateNgayXuLy,
            huyYeuCau,
            xacNhanYeuCau,
            getAllYeuCau,
            getYeuCauChuaPhanCong,
            getYeuCauTheoKyThuatVien,
            countYeuCauTheoTrangThai,
            tinhTongChiPhi
        }}>
            {children}
        </YeuCauDichVuContext.Provider>
    );
};

export const useYeuCauDichVu = () => {
    const context = useContext(YeuCauDichVuContext);
    if (!context) {
        throw new Error("useYeuCauDichVu must be used within a YeuCauDichVuProvider");
    }
    return context;
}; 