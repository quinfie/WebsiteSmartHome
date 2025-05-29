using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.IServices;
using Microsoft.Extensions.Logging;
using WebsiteSmartHome.Core;
using WebsiteSmartHome.Services;

namespace WebsiteSmartHome.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IDonHangService _donHangService;
        private readonly IVNPayService _vnPayService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(
            IDonHangService donHangService,
            IVNPayService vnPayService,
            ILogger<PaymentController> logger)
        {
            _donHangService = donHangService;
            _vnPayService = vnPayService;
            _logger = logger;
        }

        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePaymentAsync([FromBody] PaymentInformationModel model)
        {
            try
            {
                // Tạo URL thanh toán VNPAY
                var paymentUrl = _vnPayService.CreatePaymentUrl(model, HttpContext);

                return Ok(new
                {
                    success = true,
                    data = new { paymentUrl }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating VNPAY payment");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Có lỗi xảy ra khi tạo thanh toán"
                });
            }
        }

        [HttpGet("payment-callback")]
        public async Task<IActionResult> PaymentCallback()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                if (response.Success)
                {
                    // Cập nhật trạng thái đơn hàng thành "Đã xác nhận"
                    await _donHangService.UpdateOrderStatusAsync(response.OrderId, "Đã xác nhận");
                }

                // Redirect to frontend payment callback page
                var frontendCallbackUrl = $"/ecommerce/payment-callback?vnp_ResponseCode={response.VnPayResponseCode}&vnp_TxnRef={response.OrderId}&vnp_TransactionNo={response.TransactionId}&vnp_Message={response.Success}";
                return Redirect(frontendCallbackUrl);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment callback");
                // In case of an error, redirect to the error page or pass error info
                var frontendErrorUrl = $"/ecommerce/payment-callback?vnp_ResponseCode=99&vnp_Message=Unexpected+error"; // Use a generic error code for unexpected errors
                return Redirect(frontendErrorUrl);
            }
        }

        [HttpGet("payment-status")]
        public async Task<IActionResult> GetPaymentStatus([FromQuery] string orderId)
        {
            try
            {
                var donHang = await _donHangService.GetDonHangByIdAsync(orderId);
                if (donHang == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy đơn hàng"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        orderId = donHang.Id,
                        status = donHang.TrangThaiDonHang,
                        amount = donHang.TongTien
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment status for order {OrderId}", orderId);
                return StatusCode(500, new
                {
                    success = false,
                    message = "Có lỗi xảy ra khi kiểm tra trạng thái thanh toán"
                });
            }
        }
    }
}