/* ──────────────────────────────────────────────────────────────────────────
 * Title: Transportation
 * Purpose: JPA entity representing a transportation link between two locations.
 * Notes: Uniqueness enforced on (origin, destination, type).
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(
        name = "transportations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_transportation_o_d_type",
                        columnNames = {"origin_id", "destination_id", "type"}
                )
        }
)
public class Transportation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Relationships ──────────────────────────────────────────────────────

    /** Departure location (mandatory). */
    @ManyToOne(optional = false)
    @JoinColumn(name = "origin_id", nullable = false)
    private Location origin;

    /** Arrival location (mandatory). */
    @ManyToOne(optional = false)
    @JoinColumn(name = "destination_id", nullable = false)
    private Location destination;

    /** Transportation type: FLIGHT, BUS, SUBWAY, UBER. */
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private TransportationType type;

    // ── Getters & Setters ───────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Location getOrigin() { return origin; }
    public void setOrigin(Location origin) { this.origin = origin; }

    public Location getDestination() { return destination; }
    public void setDestination(Location destination) { this.destination = destination; }

    public TransportationType getType() { return type; }
    public void setType(TransportationType type) { this.type = type; }
}
