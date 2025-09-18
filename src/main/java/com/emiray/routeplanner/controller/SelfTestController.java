/* ──────────────────────────────────────────────────────────────────────────
 * Title: SelfTestController
 * Purpose: Lightweight functional checks for route rules (manual smoke tests).
 * Notes: Read-only, non-production; prefer JUnit for real test coverage.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.controller;

import com.emiray.routeplanner.repository.LocationRepository;
import com.emiray.routeplanner.service.RouteService;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@Hidden // Hide from Swagger UI; internal-only helper.
@RestController
@RequestMapping("/api/_selftest")
public class SelfTestController {

    private final RouteService routeService;
    private final LocationRepository locationRepository;

    public SelfTestController(RouteService routeService, LocationRepository locationRepository) {
        this.routeService = routeService;
        this.locationRepository = locationRepository;
    }

    // ── Manual Smoke Tests (non-exhaustive) ─────────────────────────────────
    @GetMapping
    public ResponseEntity<Map<String, Object>> run() {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("about", "Functional checks for route rules (no JUnit)");
        out.put("locationsCount", locationRepository.count());

        // TAK -> WEM: expect 6 valid routes
        final int takWem = routeService.findRoutes("TAK", "WEM", null).size();
        out.put("TAK->WEM", Map.of(
                "expected", 6,
                "actual", takWem,
                "pass", takWem == 6
        ));

        // IST -> LHR: expect exactly one single-leg (direct flight)
        final var istLhrRoutes = routeService.findRoutes("IST", "LHR", null);
        final boolean okIstLhr = istLhrRoutes.size() == 1 && istLhrRoutes.get(0).legs().size() == 1;
        out.put("IST->LHR", Map.of(
                "expected", 1,
                "actual", istLhrRoutes.size(),
                "pass", okIstLhr
        ));

        // TAK -> LHR: expect 3 valid routes
        final int takLhr = routeService.findRoutes("TAK", "LHR", null).size();
        out.put("TAK->LHR", Map.of(
                "expected", 3,
                "actual", takLhr,
                "pass", takLhr == 3
        ));

        // TAK -> IST: expect 0 valid routes (no direct FLIGHT rule fit)
        final int takIst = routeService.findRoutes("TAK", "IST", null).size();
        out.put("TAK->IST", Map.of(
                "expected", 0,
                "actual", takIst,
                "pass", takIst == 0
        ));

        final boolean allPass = takWem == 6 && okIstLhr && takLhr == 3 && takIst == 0;
        out.put("ALL_PASS", allPass);

        return ResponseEntity.ok(out);
    }
}
