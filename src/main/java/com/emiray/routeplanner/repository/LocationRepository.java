/* ──────────────────────────────────────────────────────────────────────────
 * Title: LocationRepository
 * Purpose: Spring Data JPA repository for Location entity.
 * Notes: Provides standard CRUD plus finder by unique locationCode.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.repository;

import com.emiray.routeplanner.domain.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {

    /** Find a location by its unique code (e.g., IST, LHR). */
    Optional<Location> findByLocationCode(String locationCode);
}
