/* ──────────────────────────────────────────────────────────────────────────
 * Title: TransportationDtos
 * Purpose: Request/response DTOs for Transportation entity.
 * Notes: Used to decouple API payloads from domain model.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.dto;

import com.emiray.routeplanner.domain.TransportationType;
import jakarta.validation.constraints.NotNull;

public class TransportationDtos {

    /** Request DTO for creating or updating a transportation. */
    public record UpsertRequest(
            @NotNull Long originId,
            @NotNull Long destinationId,
            @NotNull TransportationType type
    ) {}

    /** Response DTO returned after create/update/read operations. */
    public record Response(
            Long id,
            Long originId,
            String originCode,
            Long destinationId,
            String destinationCode,
            TransportationType type
    ) {}
}
