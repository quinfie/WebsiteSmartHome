export interface VaiTroDto {
  id: string;
  tenVaiTro: string;
}

export interface VaiTroCreateDto {
  tenVaiTro: string;
}

export interface VaiTroUpdateDto {
  id: string;
  tenVaiTro: string;
}
export interface ExtendedVaiTroDto extends VaiTroDto {
  soNhanVien?: number;
}