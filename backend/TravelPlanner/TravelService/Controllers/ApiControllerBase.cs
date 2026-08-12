using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace TravelService.Controllers
{
    public abstract class ApiControllerBase : ControllerBase
    {
        protected int CurrentUserId => int.Parse(User.FindFirst("sub").Value);
    }
}
