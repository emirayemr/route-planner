/* ──────────────────────────────────────────────────────────────────────────
 * Title: TransportationController
 * Purpose: Exposes CRUD endpoints for Transportation links between locations.
 * Notes: Keeps controller thin; delegates business rules to TransportationService.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.controller;

import com.emiray.routeplanner.domain.Transportation;
import com.emiray.routeplanner.dto.TransportationDtos;
import com.emiray.routeplanner.repository.TransportationRepository;
import com.emiray.routeplanner.service.TransportationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

import static com.emiray.routeplanner.service.TransportationService.toResponse;

@Tag(
        name = "Transportations",
        description = "CRUD endpoints for travel connections between locations."
)
@RestController
@RequestMapping("/api/transportations")
public class TransportationController {

    private final TransportationRepository repo;
    private final TransportationService service;

    public TransportationController(TransportationRepository repo, TransportationService service) {
        this.repo = repo;
        this.service = service;
    }

    // ── Read ────────────────────────────────────────────────────────────────

    @Operation(summary = "List all transportations")
    @GetMapping
    public List<Transportation> all() {
        // Returns entities for simplicity; create/update responses use DTOs.
        return repo.findAll();
    }

    @Operation(summary = "Get a transportation by ID")
    @GetMapping("/{id}")
    public ResponseEntity<Transportation> byId(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Write ───────────────────────────────────────────────────────────────

    @Operation(summary = "Create a transportation (originId, destinationId, type)")
    @PostMapping
    public ResponseEntity<TransportationDtos.Response> create(
            @Valid @RequestBody TransportationDtos.UpsertRequest req
    ) {
        Transportation saved = service.create(req);
        return ResponseEntity
                .created(URI.create("/api/transportations/" + saved.getId()))
                .body(toResponse(saved));
    }

    @Operation(summary = "Update a transportation (originId, destinationId, type)")
    @PutMapping("/{id}")
    public ResponseEntity<TransportationDtos.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody TransportationDtos.UpsertRequest req
    ) {
        Transportation updated = service.update(id, req);
        return ResponseEntity.ok(toResponse(updated));
    }

    @Operation(summary = "Delete a transportation by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
