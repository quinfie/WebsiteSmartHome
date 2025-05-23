using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Libaries;

namespace WebsiteSmartHome.Services
{
    public class VNPayService : IVNPayService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<VNPayService> _logger;

        public VNPayService(IConfiguration configuration, ILogger<VNPayService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public string CreatePaymentUrl(PaymentInformationModel model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var txnRef = DateTime.Now.Ticks.ToString();
            var orderInfo = $"{model.OrderId} - {model.Name} {model.OrderDescription} {model.Amount}";

            var vnpay = new VnPayLibrary();
            vnpay.AddRequestData("vnp_Version", _configuration["VNPay:Version"]);
            vnpay.AddRequestData("vnp_Command", _configuration["VNPay:Command"]);
            vnpay.AddRequestData("vnp_TmnCode", _configuration["VNPay:TmnCode"]);
            vnpay.AddRequestData("vnp_Amount", ((int)(model.Amount * 100)).ToString());
            vnpay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", _configuration["VNPay:CurrCode"]);
            vnpay.AddRequestData("vnp_IpAddr", vnpay.GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", _configuration["VNPay:Locale"]);
            vnpay.AddRequestData("vnp_OrderInfo", orderInfo);
            vnpay.AddRequestData("vnp_OrderType", model.OrderType);
            vnpay.AddRequestData("vnp_ReturnUrl", _configuration["VNPay:PaymentBackReturnUrl"]);
            vnpay.AddRequestData("vnp_TxnRef", txnRef);

            var paymentUrl = vnpay.CreateRequestUrl(_configuration["VNPay:BaseUrl"], _configuration["VNPay:HashSecret"]);

            _logger.LogInformation("VNPAY URL: {PaymentUrl}", paymentUrl);
            return paymentUrl;
        }

        public PaymentResponseModel PaymentExecute(IQueryCollection collections)
        {
            var vnpay = new VnPayLibrary();
            var response = new PaymentResponseModel();

            foreach (var (key, value) in collections)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var orderId = vnpay.GetResponseData("vnp_TxnRef");
            var vnPayTranId = vnpay.GetResponseData("vnp_TransactionNo");
            var vnpResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnpSecureHash = collections.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value;
            var orderInfo = vnpay.GetResponseData("vnp_OrderInfo");

            bool checkSignature = vnpay.ValidateSignature(vnpSecureHash, _configuration["VNPay:HashSecret"]);

            if (checkSignature)
            {
                if (vnpResponseCode == "00")
                {
                    response.Success = true;
                    response.OrderId = orderId;
                    response.TransactionId = vnPayTranId;
                    response.PaymentMethod = "VNPAY";
                    response.PaymentId = vnPayTranId;
                    response.OrderDescription = orderInfo;
                    response.VnPayResponseCode = vnpResponseCode;
                    response.Token = vnpSecureHash;
                }
                else
                {
                    response.Success = false;
                    response.VnPayResponseCode = vnpResponseCode;
                }
            }
            else
            {
                response.Success = false;
                response.VnPayResponseCode = "97"; // Invalid signature
            }

            return response;
        }
    }
}
