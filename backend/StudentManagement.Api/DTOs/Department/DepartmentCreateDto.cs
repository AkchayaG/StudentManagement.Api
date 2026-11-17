
using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Api.DTOs;

public class DepartmentCreateDto
{
    [Required]
    [MaxLength(20)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Description { get; set; } = string.Empty;
}
