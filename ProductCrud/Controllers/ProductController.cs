using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProductCrud.ModelEdit;
using ProductCrud.Models;
using System;
using System.IO;
using System.Linq;

namespace ProductCrud.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ProductController : ControllerBase
	{
		private readonly ProductCrudContext _context;
		private readonly IWebHostEnvironment _env;
		private readonly ILogger<ProductController> _logger;

		public ProductController(ProductCrudContext context, IWebHostEnvironment env, ILogger<ProductController> logger)
		{
			_context = context;
			_env = env;
			_logger = logger;
		}

		[HttpPost("AddCategory")]
		public IActionResult AddCategory(CategoryEdit edit)
		{
			try
			{
				int id = _context.Categories.Any() ? _context.Categories.Max(e => e.Cid) + 1 : 1;
				edit.Cid = id;

				if (!string.IsNullOrEmpty(edit.Cname))
				{
					var category = new Category
					{
						Cid = edit.Cid,
						Cname = edit.Cname,
					};

					_context.Categories.Add(category);
					_context.SaveChanges();
					return Ok(category);
				}
				else
				{
					return BadRequest("Category name is needed.");
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error occurred while adding category.");
				return StatusCode(500, "An internal server error occurred.");
			}
		}

		[HttpGet("GetCategories")]
		public IActionResult GetCategories()
		{
			try
			{
				var categories = _context.Categories.ToList();
				if (categories.Any())
				{
					return Ok(categories);
				}
				else
				{
					return NotFound("No categories found.");
				}
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error occurred while retrieving categories.");
				return StatusCode(500, "An internal server error occurred.");
			}
		}

		[HttpPost("AddProducts")]
		[Authorize]
		public IActionResult AddProducts([FromForm] ProductEdit edit)
		{
			
			var user = HttpContext.User.FindFirst("Id");
			var userId = user?.Value;

			_logger.LogInformation("User ID: {UserId}", userId);

			try
			{
				int id = _context.Products.Any() ? _context.Products.Max(e => e.Pid) + 1 : 1;
				edit.Pid = id;

				if (edit.formFile != null)
				{
					string fileName = Guid.NewGuid().ToString() + Path.GetExtension(edit.formFile.FileName);
					string filePath = Path.Combine(_env.WebRootPath, "ProductImage", fileName);

					using (var stream = new FileStream(filePath, FileMode.Create))
					{
						edit.formFile.CopyTo(stream);
					}

					edit.Pimage = $"{Request.Scheme}://{Request.Host}/ProductImage/{fileName}";
				}

				var product = new Product
				{
					Pid = edit.Pid,
					Pimage = edit.Pimage,
					Pdescription = edit.Pdescription,
					Pname = edit.Pname,
					Price = edit.Price,
					Cid = Convert.ToInt32(edit.Cid),
					UserId = Convert.ToInt32(userId), 
				};

				_context.Products.Add(product);
				_context.SaveChanges();
				return Ok(product);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Error occurred while adding product.");
				return StatusCode(500, "An internal server error occurred.");
			}
		}

		[HttpGet("GetProducts")]

		public IActionResult GetProducts()
		{
			try
			{
				if (!_context.Products.Any())
				{
					return NotFound("No Producst Available");
				}
				else
				{
					var product = _context.Products.ToList();

					return Ok(product);	
				}
			}
			catch (Exception ex)
			{
				return StatusCode(500, "An INternal Server Occured" + ex.Message);
			}
		}

		[HttpGet("Categories/{id}")]
		public IActionResult GetCategory(int id)
		{
			try
			{
				var Product = _context.Products.Where(e => e.Cid == id).ToList();	
				return Ok(Product);

			}
			catch (Exception ex)
			{
				return StatusCode(500, "An INternal Server Occured" + ex.Message);
			}
		}
	}
}
