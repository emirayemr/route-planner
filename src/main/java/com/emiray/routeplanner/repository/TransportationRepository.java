/* ──────────────────────────────────────────────────────────────────────────
 * Title: TransportationRepository
 * Purpose: Spring Data JPA repository for Transportation entity.
 * Notes: Provides CRUD plus helpers to query by origin or destination.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.repository;

import com.emiray.routeplanner.domain.Location;
import com.emiray.routeplanner.domain.Transportation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportationRepository extends JpaRepository<Transportation, Long> {

    /** Find all transportations departing from a given origin. */
    List<Transportation> findByOrigin(Location origin);

    /** Find all transportations arriving at a given destination. */
    List<Transportation> findByDestination(Location destination);
}
