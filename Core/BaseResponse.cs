using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.Core.Utils;
using WebsiteSmartHome.Core.Data;
using WebsiteSmartHome.Core.DTOs;

namespace WebsiteSmartHome.Core
{
    public class BaseResponse<T>
    {
        public T? Data { get; set; }
        public string? Message { get; set; }
        public StatusCodeHelper StatusCode { get; set; }
        public string? Code { get; set; }
        public bool Success { get; set; }

        public BaseResponse() { }

        public BaseResponse(StatusCodeHelper statusCode, string code, T? data, string? message)
        {
            Data = data;
            Message = message;
            StatusCode = statusCode;
            Code = code;
            Success = true;
        }

        public BaseResponse(StatusCodeHelper statusCode, string code, T? data)
        {
            Data = data;
            StatusCode = statusCode;
            Code = code;
            Success = true;
        }

        public BaseResponse(StatusCodeHelper statusCode, string code, string? message)
        {
            Message = message;
            StatusCode = statusCode;
            Code = code;
            Success = true;
        }

        public static BaseResponse<T> OkResponse(T? data, string message = "Thành công")
        {
            return new BaseResponse<T>(StatusCodeHelper.OK, StatusCodeHelper.OK.ToString(), data, message);
        }

        public static BaseResponse<T> OkResponse(string? message)
        {
            return new BaseResponse<T>(StatusCodeHelper.OK, StatusCodeHelper.OK.ToString(), message);
        }

        public static BaseResponse<T> OkResponse(T? data)
        {
            return new BaseResponse<T>(StatusCodeHelper.OK, StatusCodeHelper.OK.ToString(), data);
        }

        public static BaseResponse<T> ErrorResponse(string message)
        {
            return new BaseResponse<T>(StatusCodeHelper.BadRequest, StatusCodeHelper.BadRequest.ToString(), default(T), message);
        }

        public static BaseResponse<T> ServerErrorResponse(string message)
        {
            return new BaseResponse<T>(StatusCodeHelper.ServerError, StatusCodeHelper.ServerError.ToString(), default(T), message);
        }

        internal ActionResult<DanhMuc> OkResponse(DanhMuc danhMuc)
        {
            throw new NotImplementedException();
        }

        internal static ActionResult<SanPham> OkResponse(SanPham sanPham)
        {
            throw new NotImplementedException();
        }

        public static BaseResponse<T> Created(T? data, string? message = "Tạo mới thành công")
        {
            return new BaseResponse<T>(StatusCodeHelper.CREATED, StatusCodeHelper.CREATED.Name(), data, message);
        }

        internal static ActionResult<BaseResponse<KhuyenMaiDto>> BadRequestResponse(string v1, string v2)
        {
            throw new NotImplementedException();
        }
    }

    // DTO for paginated data
    public class PagedResponse<T>
    {
        public List<T> Data { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }

        public PagedResponse(List<T> data, int pageNumber, int pageSize, int totalCount)
        {
            Data = data;
            PageNumber = pageNumber;
            PageSize = pageSize;
            TotalCount = totalCount;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        }
    }
}
