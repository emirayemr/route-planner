/* ──────────────────────────────────────────────────────────────────────────
 * Title: RouteServiceIntegrationTest
 * Purpose: End-to-end integration test for route-finding logic.
 * Notes: Uses in-memory H2 with data.sql to validate rules from case study.
 *        Ensures service returns correct number of valid routes per scenario.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner;

import com.emiray.routeplanner.dto.RouteDtos;
import com.emiray.routeplanner.service.RouteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class RouteServiceIntegrationTest {

    @Autowired
    private RouteService routeService;

    /** TAK ➝ WEM: should return 6 valid routes (per case study example). */
    @Test
    void takToWem_shouldHave6Routes() {
        int actual = routeService.findRoutes("TAK", "WEM", null).size();
        assertThat(actual).isEqualTo(6);
    }

    /** IST ➝ LHR: should be exactly one direct flight. */
    @Test
    void istToLhr_shouldBeSingleFlight() {
        List<RouteDtos.Route> routes = routeService.findRoutes("IST", "LHR", null);
        assertThat(routes).hasSize(1);
        assertThat(routes.get(0).legs()).hasSize(1);
    }

    /** TAK ➝ LHR: should produce 3 valid route options (with transfers). */
    @Test
    void takToLhr_shouldHave3Routes() {
        int actual = routeService.findRoutes("TAK", "LHR", null).size();
        assertThat(actual).isEqualTo(3);
    }

    /** TAK ➝ IST: should yield zero valid routes (no FLIGHT included). */
    @Test
    void takToIst_shouldHaveZeroRoutes() {
        int actual = routeService.findRoutes("TAK", "IST", null).size();
        assertThat(actual).isZero();
    }
}
