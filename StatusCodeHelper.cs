using WebsiteSmartHome.Core.Utils;

namespace WebsiteSmartHome.Core.Utils 
{
    public enum StatusCodeHelper
    {
        [CustomName("Success")]
        OK = 200,

        [CustomName("Created")]
        CREATED = 201,

        [CustomName("Bad Request")]
        BadRequest = 400,

        [CustomName("Unauthorized")]
        Unauthorized = 401,

        [CustomName("Internal Server Error")]
        ServerError = 500

    }
}
