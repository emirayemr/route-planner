/* ──────────────────────────────────────────────────────────────────────────
 * Title: TransportationService
 * Purpose: Encapsulates business rules for creating/updating Transportation.
 * Notes: Validates existence and distinctness of origin/destination; maps
 *        domain entities to DTOs for API responses.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.service;

import com.emiray.routeplanner.domain.Location;
import com.emiray.routeplanner.domain.Transportation;
import com.emiray.routeplanner.dto.TransportationDtos;
import com.emiray.routeplanner.repository.LocationRepository;
import com.emiray.routeplanner.repository.TransportationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
public class TransportationService {

    private final TransportationRepository transportationRepository;
    private final LocationRepository locationRepository;

    public TransportationService(TransportationRepository transportationRepository,
                                 LocationRepository locationRepository) {
        this.transportationRepository = transportationRepository;
        this.locationRepository = locationRepository;
    }

    // ── Guards ──────────────────────────────────────────────────────────────

    /** Ensure origin and destination are not the same location. */
    private void assertDifferent(Location origin, Location destination) {
        if (Objects.equals(origin.getId(), destination.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "origin and destination must be different");
        }
    }

    // ── Commands ────────────────────────────────────────────────────────────

    /** Create a transportation after validating endpoints. */
    public Transportation create(TransportationDtos.UpsertRequest req) {
        Location origin = locationRepository.findById(req.originId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Origin not found"));
        Location destination = locationRepository.findById(req.destinationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destination not found"));
        assertDifferent(origin, destination);

        Transportation t = new Transportation();
        t.setOrigin(origin);
        t.setDestination(destination);
        t.setType(req.type());
        return transportationRepository.save(t);
    }

    /** Update an existing transportation after validating endpoints. */
    public Transportation update(Long id, TransportationDtos.UpsertRequest req) {
        Transportation existing = transportationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transportation not found"));

        Location origin = locationRepository.findById(req.originId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Origin not found"));
        Location destination = locationRepository.findById(req.destinationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destination not found"));
        assertDifferent(origin, destination);

        existing.setOrigin(origin);
        existing.setDestination(destination);
        existing.setType(req.type());
        return transportationRepository.save(existing);
    }

    // ── Mapping ─────────────────────────────────────────────────────────────

    /** Map domain entity to response DTO. */
    public static TransportationDtos.Response toResponse(Transportation t) {
        return new TransportationDtos.Response(
                t.getId(),
                t.getOrigin().getId(),
                t.getOrigin().getLocationCode(),
                t.getDestination().getId(),
                t.getDestination().getLocationCode(),
                t.getType()
        );
    }
}
