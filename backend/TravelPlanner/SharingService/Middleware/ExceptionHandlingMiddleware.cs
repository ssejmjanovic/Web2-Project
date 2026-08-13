using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SharingService.Exceptions;

namespace SharingService.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(
            RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                await HandleAsync(context, exception);
            }
        }

        private async Task HandleAsync(HttpContext context, Exception exception)
        {
            var statusCode = exception switch
            {
                ValidationException _ => HttpStatusCode.BadRequest,
                UnauthorizedException _ => HttpStatusCode.Unauthorized,
                ForbiddenException _ => HttpStatusCode.Forbidden,
                NotFoundException _ => HttpStatusCode.NotFound,
                ConflictException _ => HttpStatusCode.Conflict,
                _ => HttpStatusCode.InternalServerError
            };

            if (statusCode == HttpStatusCode.InternalServerError)
                _logger.LogError(exception, "Unhandled exception while processing request.");

            var message = statusCode == HttpStatusCode.InternalServerError
                ? "An unexpected error occurred."
                : exception.Message;

            context.Response.Clear();
            context.Response.StatusCode = (int)statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(new { message }));
        }
    }
}
}
