using System.ComponentModel;
using System.Reflection;

namespace WebsiteSmartHome.Core.Utils
{
    public static class GetDesriptionHelper
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

        public static string GetDescription(this string enumValueName, Type enumType)
        {
            if (!enumType.IsEnum)
                throw new ArgumentException("enumType must be an Enum type");

            if (!Enum.TryParse(enumType, enumValueName, out var enumValue))
                throw new ArgumentException($"'{enumValueName}' is not a valid value for enum '{enumType.Name}'");

            var field = enumType.GetField(enumValueName);
            var attribute = field?.GetCustomAttribute<DescriptionAttribute>();
            return attribute?.Description ?? enumValueName;
        }
    }
}