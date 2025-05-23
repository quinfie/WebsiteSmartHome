using WebsiteSmartHome.Core;

namespace WebsiteSmartHome.IServices
{
    public interface IVNPayService
    {
        string CreatePaymentUrl(PaymentInformationModel model, HttpContext context);
        PaymentResponseModel PaymentExecute(IQueryCollection collections);

    }
}
