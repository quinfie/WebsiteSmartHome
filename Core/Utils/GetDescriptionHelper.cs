using System.ComponentModel;
using System.Reflection;

namespace WebsiteSmartHome.Core.Utils
{
    public class GetDesriptionHelper
    {
        public static string? GetEnumNameByDescription<TEnum>(string description) where TEnum : Enum
        {
            foreach (var field in typeof(TEnum).GetFields())
            {
                var attr = field.GetCustomAttribute<DescriptionAttribute>();
                if (attr != null && attr.Description.Equals(description, StringComparison.OrdinalIgnoreCase))
                {
                    return field.Name;
                }
            }
            return null;
        }
    }
}