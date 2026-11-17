
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Data;
using StudentManagement.Api.DTOs;
using StudentManagement.Api.Models;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/departments")]
[Authorize(Roles = "Admin,Staff")]
public class DepartmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DepartmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    private static DepartmentResponseDto ToDto(Department d)
    {
        return new DepartmentResponseDto
        {
            Id = d.Id,
            Code = d.Code,
            Name = d.Name,
            Description = d.Description,
            CreatedAt = d.CreatedAt
        };
    }

    // VIEW ALL - ADMIN AND STAFF
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _context.Departments
            .AsNoTracking()
            .OrderBy(d => d.Id)
            .ToListAsync();

        return Ok(departments.Select(ToDto));
    }

    // VIEW BY ID - ADMIN AND STAFF
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var department = await _context.Departments
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null)
            return NotFound(new { message = "Department not found" });

        return Ok(ToDto(department));
    }

    // SEARCH - ADMIN AND STAFF
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? keyword)
    {
        if (string.IsNullOrWhiteSpace(keyword))
            return await GetAll();

        var term = keyword.Trim();

        var departments = await _context.Departments
            .AsNoTracking()
            .Where(d =>
                d.Code.Contains(term) ||
                d.Name.Contains(term))
            .OrderBy(d => d.Id)
            .ToListAsync();

        return Ok(departments.Select(ToDto));
    }

    // ADD - ADMIN ONLY
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        [FromBody] DepartmentCreateDto dto)
    {
        var code = dto.Code.Trim().ToUpperInvariant();
        var name = dto.Name.Trim();

        if (string.IsNullOrWhiteSpace(code) ||
            string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Code and name are required" });

        bool exists = await _context.Departments
            .AnyAsync(d => d.Code == code);

        if (exists)
            return Conflict(new { message = "Department code already exists" });

        var department = new Department
        {
            Code = code,
            Name = name,
            Description = dto.Description?.Trim() ?? string.Empty
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetById),
            new { id = department.Id },
            ToDto(department));
    }

    // UPDATE - ADMIN ONLY
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] DepartmentUpdateDto dto)
    {
        var department = await _context.Departments.FindAsync(id);

        if (department == null)
            return NotFound(new { message = "Department not found" });

        var code = dto.Code.Trim().ToUpperInvariant();
        var name = dto.Name.Trim();

        if (string.IsNullOrWhiteSpace(code) ||
            string.IsNullOrWhiteSpace(name))
            return BadRequest(new { message = "Code and name are required" });

        bool duplicate = await _context.Departments.AnyAsync(
            d => d.Id != id && d.Code == code);

        if (duplicate)
            return Conflict(new { message = "Department code already exists" });

        department.Code = code;
        department.Name = name;
        department.Description = dto.Description?.Trim() ?? string.Empty;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Department updated successfully",
            department = ToDto(department)
        });
    }

    // DELETE - ADMIN ONLY
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var department = await _context.Departments.FindAsync(id);

        if (department == null)
            return NotFound(new { message = "Department not found" });

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Department deleted successfully" });
    }
}
