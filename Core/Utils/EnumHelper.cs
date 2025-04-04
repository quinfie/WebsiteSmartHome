using System.ComponentModel;
using System.Reflection;

namespace WebsiteSmartHome.Core.Utils
{
    public static class EnumHelper
    {
        public static string Name<T>(this T srcValue) => GetCustomName(typeof(T).GetField(srcValue?.ToString() ?? string.Empty));
        private static string GetCustomName(FieldInfo? fi)
        {
            Type type = typeof(CustomName);

            Attribute? attr = null;
            if (fi is not null)
            {
                attr = Attribute.GetCustomAttribute(fi, type);
            }

            return (attr as CustomName)?.Name ?? string.Empty;
        }
        public static string GetDescription(Enum value)
        {
            FieldInfo? field = value.GetType().GetField(value.ToString());
            DescriptionAttribute? attribute = field?.GetCustomAttribute<DescriptionAttribute>();

            return attribute != null ? attribute.Description : value.ToString();
        }
        public static T GetEnumFromDescription<T>(string description) where T : Enum
        {
            foreach (T item in Enum.GetValues(typeof(T)))
            {
                if (GetDescription(item as Enum) == description)
                {
                    return item;
                }
            }
            throw new ArgumentException("Không tìm thấy giá trị enum tương ứng.");
        }
    }
}
