/* ──────────────────────────────────────────────────────────────────────────
 * Title: RoutesController
 * Purpose: Expose read-only endpoints that return valid routes between two
 *          locations under domain rules (≤ 3 legs, exactly 1 FLIGHT).
 * Notes: Controller stays thin; delegates logic to RouteService.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.controller;

import com.emiray.routeplanner.dto.RouteDtos;
import com.emiray.routeplanner.service.RouteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(
        name = "Routes",
        description = "Returns valid routes between origin and destination (≤ 3 legs, exactly 1 FLIGHT)."
)
@RestController
@RequestMapping("/api/routes")
public class RoutesController {

    private final RouteService routeService;

    public RoutesController(RouteService routeService) {
        this.routeService = routeService;
    }

    // ── Read ────────────────────────────────────────────────────────────────

    @Operation(
            summary = "Get valid routes",
            description = """
                    Rules:
                    (1) Up to 3 legs,
                    (2) Exactly 1 FLIGHT is required,
                    (3) Any before/after transfers must be non-FLIGHT,
                    (4) For chained legs, arrival == next departure.
                    Optional: pass `date` to allow service-level filtering if supported.
                    """
    )
    @GetMapping
    public List<RouteDtos.Route> routes(
            @Parameter(description = "Origin location code (e.g., IST, TAK)")
            @RequestParam String origin,
            @Parameter(description = "Destination location code (e.g., LHR, WEM)")
            @RequestParam String destination,
            @Parameter(description = "Optional travel date (YYYY-MM-DD). Service may ignore if not applicable.")
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return routeService.findRoutes(origin, destination, date);
    }
}
