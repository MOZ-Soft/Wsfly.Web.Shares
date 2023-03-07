using System;

namespace Wsfly.ERP.Web.Shares
{
    public static class SystemTime
    {
        public static Func<DateTime> Now = () => DateTime.UtcNow;
    }
}