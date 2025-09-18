/* ──────────────────────────────────────────────────────────────────────────
 * Title: RoutePlannerApplication
 * Purpose: Spring Boot entry point for the Route Planner API.
 * Notes: Auto-configures web, JPA, and OpenAPI components via @SpringBootApplication.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RoutePlannerApplication {

    public static void main(String[] args) {
        SpringApplication.run(RoutePlannerApplication.class, args);
    }
}
