/* ──────────────────────────────────────────────────────────────────────────
 * Title: LocationController
 * Purpose: Exposes CRUD endpoints for Location entities.
 * Notes: Keeps controller thin; delegates persistence to LocationRepository.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.controller;

import com.emiray.routeplanner.domain.Location;
import com.emiray.routeplanner.repository.LocationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(
        name = "Locations",
        description = "CRUD endpoints for airports and other points of interest."
)
@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationRepository repo;

    public LocationController(LocationRepository repo) {
        this.repo = repo;
    }

    // ── Read ────────────────────────────────────────────────────────────────

    @Operation(summary = "List all locations")
    @GetMapping
    public List<Location> all() {
        return repo.findAll();
    }

    @Operation(summary = "Get a location by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Location> byId(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Write ───────────────────────────────────────────────────────────────

    @Operation(summary = "Create a new location")
    @PostMapping
    public ResponseEntity<Location> create(@Valid @RequestBody Location body) {
        Location saved = repo.save(body);
        return ResponseEntity
                .created(URI.create("/api/locations/" + saved.getId()))
                .body(saved);
    }

    @Operation(summary = "Update an existing location")
    @PutMapping("/{id}")
    public ResponseEntity<Location> update(@PathVariable Long id, @Valid @RequestBody Location body) {
        return repo.findById(id).map(existing -> {
            // Safe, explicit field updates (no partial merge ambiguity)
            existing.setName(body.getName());
            existing.setCountry(body.getCountry());
            existing.setCity(body.getCity());
            existing.setLocationCode(body.getLocationCode());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete a location by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
