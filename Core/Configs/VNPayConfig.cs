using System;

namespace Core.Configs
{
    public class VNPayConfig
    {
        public static string ConfigName => "VNPay";
        public string PaymentUrl { get; set; } = string.Empty;
        public string ReturnUrl { get; set; } = string.Empty;
        public string TmnCode { get; set; } = string.Empty;
        public string HashSecret { get; set; } = string.Empty;
        public string Command { get; set; } = "pay";
        public string CurrCode { get; set; } = "VND";
        public string Version { get; set; } = "2.1.0";
        public string Locale { get; set; } = "vn";
    }
}