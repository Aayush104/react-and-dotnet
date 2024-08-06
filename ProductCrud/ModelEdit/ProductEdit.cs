namespace ProductCrud.ModelEdit
{
	public class ProductEdit
	{
		public int Pid { get; set; }

		public string Pname { get; set; } = null!;

		public string Pdescription { get; set; } = null!;

		public decimal Price { get; set; }
		public int? UserId { get; set; }

		public int? Cid { get; set; }
		public string? Pimage { get; set; }

		public IFormFile? formFile { get; set; }
	}
}
