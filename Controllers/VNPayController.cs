using Microsoft.AspNetCore.Mvc;
using WebsiteSmartHome.IServices;
using WebsiteSmartHome.Core;
using Microsoft.Extensions.Configuration;

namespace WebsiteSmartHome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VNPayController : ControllerBase
    {
        private readonly IVNPayService _vnPayService;
        private readonly IConfiguration _configuration;

        public VNPayController(IVNPayService vnPayService, IConfiguration configuration)
        {
            _vnPayService = vnPayService;
            _configuration = configuration;
        }

        [HttpPost("create-payment")]
        public IActionResult CreatePayment([FromBody] PaymentInformationModel model)
        {
            try
            {
                var paymentUrl = _vnPayService.CreatePaymentUrl(model, HttpContext);
                return Ok(new
                {
                    success = true,
                    data = new { paymentUrl }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("payment-callback")]
        public IActionResult PaymentCallback()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                // Return JSON response instead of redirecting
                return Ok(new
                {
                    success = response.Success,
                    message = response.Success ? "Payment successful" : "Payment failed",
                    data = new
                    {
                        orderDescription = response.OrderDescription,
                        transactionId = response.TransactionId,
                        orderId = response.OrderId,
                        paymentMethod = response.PaymentMethod,
                        paymentId = response.PaymentId,
                        vnPayResponseCode = response.VnPayResponseCode,
                        token = response.Token
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("payment-status")]
        public IActionResult GetPaymentStatus([FromQuery] string orderId)
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);
                return Ok(new
                {
                    success = response.Success,
                    message = response.Success ? "Payment successful" : "Payment failed",
                    data = new
                    {
                        orderDescription = response.OrderDescription,
                        transactionId = response.TransactionId,
                        orderId = response.OrderId,
                        paymentMethod = response.PaymentMethod,
                        paymentId = response.PaymentId,
                        vnPayResponseCode = response.VnPayResponseCode,
                        token = response.Token
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
    }
}