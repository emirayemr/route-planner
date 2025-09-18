/* ──────────────────────────────────────────────────────────────────────────
 * Title: Location
 * Purpose: JPA entity representing a location (airport, city, or point of interest).
 * Notes: Validated with Bean Validation; normalized before persistence.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(
        name = "locations",
        indexes = {
                @Index(name = "idx_location_code", columnList = "locationCode", unique = true)
        })
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private String city;

    @NotBlank
    @Size(min = 3, max = 10)
    @Pattern(
            regexp = "^[A-Z0-9]{3,10}$",
            message = "locationCode must be 3-10 uppercase letters/digits"
    )
    @Column(nullable = false, unique = true, length = 10)
    private String locationCode;

    // ── Lifecycle Callbacks ─────────────────────────────────────────────────
    @PrePersist
    @PreUpdate
    private void normalize() {
        if (locationCode != null) {
            locationCode = locationCode.trim().toUpperCase();
        }
        if (country != null) {
            country = country.trim().toUpperCase(); // also normalize country
        }
    }

    // ── Getters & Setters ───────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocationCode() { return locationCode; }
    public void setLocationCode(String locationCode) { this.locationCode = locationCode; }
}
