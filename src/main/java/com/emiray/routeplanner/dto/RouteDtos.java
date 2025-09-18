/* ──────────────────────────────────────────────────────────────────────────
 * Title: RouteDtos
 * Purpose: Lightweight DTOs for representing valid routes and their legs.
 * Notes: Used as API response payloads; immutable records for clarity.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.dto;

import com.emiray.routeplanner.domain.TransportationType;
import java.util.List;

public class RouteDtos {

    /** A single leg in a route (transportation between two locations). */
    public record Leg(
            Long transportationId,
            String originCode,
            String destinationCode,
            TransportationType type
    ) {}

    /** A full route, consisting of one or more connected legs. */
    public record Route(
            List<Leg> legs
    ) {}
}
