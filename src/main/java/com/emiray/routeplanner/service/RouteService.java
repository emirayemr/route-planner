/* ──────────────────────────────────────────────────────────────────────────
 * Title: RouteService
 * Purpose: Build all valid routes between two locations under domain rules
 *          (≤ 3 legs, exactly 1 FLIGHT; optional non-FLIGHT before/after).
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.service;

import com.emiray.routeplanner.domain.Location;
import com.emiray.routeplanner.domain.Transportation;
import com.emiray.routeplanner.domain.TransportationType;
import com.emiray.routeplanner.dto.RouteDtos;
import com.emiray.routeplanner.repository.LocationRepository;
import com.emiray.routeplanner.repository.TransportationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RouteService {

    private final LocationRepository locationRepository;
    private final TransportationRepository transportationRepository;

    public RouteService(LocationRepository locationRepository,
                        TransportationRepository transportationRepository) {
        this.locationRepository = locationRepository;
        this.transportationRepository = transportationRepository;
    }

    /**
     * Finds all valid routes between origin and destination, optionally filtering by date.
     * Rules: ≤3 legs; exactly 1 FLIGHT; before/after transfers (if present) must be non-FLIGHT.
     */
    public List<RouteDtos.Route> findRoutes(String originCode, String destinationCode, LocalDate date) {
        final Location origin = locationRepository.findByLocationCode(originCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Origin code not found: " + originCode));

        final Location destination = locationRepository.findByLocationCode(destinationCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Destination code not found: " + destinationCode));

        // Fetch all transportations once (simple dataset; acceptable for case study scale).
        final List<Transportation> all = transportationRepository.findAll();

        // Generate 1, 2, 3-leg candidates
        List<List<Transportation>> candidates = new ArrayList<>();
        candidates.addAll(oneLeg(all, origin, destination));
        candidates.addAll(twoLegs(all, origin, destination));
        candidates.addAll(threeLegs(all, origin, destination));

        // Apply domain rules
        List<List<Transportation>> valid = candidates.stream()
                .filter(this::isConnected)               // A->B, B->C ...
                .filter(this::hasExactlyOneFlight)       // exactly 1 FLIGHT
                .filter(this::beforeAfterTransfersValid) // at most 1 before & 1 after (non-FLIGHT)
                .collect(Collectors.toList());

        // Bonus: filter by operating days if date provided (no-op when field missing)
        if (date != null) {
            int dow = mapToCaseStudyDow(date.getDayOfWeek()); // 1=Mon ... 7=Sun
            valid = valid.stream()
                    .filter(path -> operatesOn(path, dow))
                    .collect(Collectors.toList());
        }

        // Map to response DTO
        return valid.stream().map(this::toDto).collect(Collectors.toList());
    }

    // ── Candidate builders ──────────────────────────────────────────────────

    private List<List<Transportation>> oneLeg(List<Transportation> all, Location origin, Location dest) {
        return all.stream()
                .filter(t -> t.getOrigin().getId().equals(origin.getId())
                        && t.getDestination().getId().equals(dest.getId()))
                .map(Collections::singletonList)
                .collect(Collectors.toList());
    }

    private List<List<Transportation>> twoLegs(List<Transportation> all, Location origin, Location dest) {
        List<List<Transportation>> result = new ArrayList<>();
        for (Transportation first : all) {
            if (!first.getOrigin().getId().equals(origin.getId())) continue;
            for (Transportation second : all) {
                if (!first.getDestination().getId().equals(second.getOrigin().getId())) continue;
                if (!second.getDestination().getId().equals(dest.getId())) continue;
                result.add(Arrays.asList(first, second));
            }
        }
        return result;
    }

    private List<List<Transportation>> threeLegs(List<Transportation> all, Location origin, Location dest) {
        List<List<Transportation>> result = new ArrayList<>();
        for (Transportation first : all) {
            if (!first.getOrigin().getId().equals(origin.getId())) continue;
            for (Transportation second : all) {
                if (!first.getDestination().getId().equals(second.getOrigin().getId())) continue;
                for (Transportation third : all) {
                    if (!second.getDestination().getId().equals(third.getOrigin().getId())) continue;
                    if (!third.getDestination().getId().equals(dest.getId())) continue;
                    result.add(Arrays.asList(first, second, third));
                }
            }
        }
        return result;
    }

    // ── Domain rules ────────────────────────────────────────────────────────

    /** Ensure consecutive legs connect (arrival == next departure). */
    private boolean isConnected(List<Transportation> path) {
        for (int i = 0; i < path.size() - 1; i++) {
            Long a = path.get(i).getDestination().getId();
            Long b = path.get(i + 1).getOrigin().getId();
            if (!Objects.equals(a, b)) return false;
        }
        return true;
    }

    /** Exactly one flight per path. */
    private boolean hasExactlyOneFlight(List<Transportation> path) {
        long flights = path.stream().filter(t -> t.getType() == TransportationType.FLIGHT).count();
        return flights == 1;
    }

    /** At most one non-FLIGHT before and one non-FLIGHT after the single FLIGHT. */
    private boolean beforeAfterTransfersValid(List<Transportation> path) {
        int flightIndex = -1;
        for (int i = 0; i < path.size(); i++) {
            if (path.get(i).getType() == TransportationType.FLIGHT) {
                if (flightIndex != -1) return false; // more than one flight
                flightIndex = i;
            }
        }
        if (flightIndex == -1) return false; // no flight

        // Before flight
        int beforeCount = flightIndex;
        if (beforeCount > 1) return false;
        for (int i = 0; i < flightIndex; i++) {
            if (path.get(i).getType() == TransportationType.FLIGHT) return false;
        }

        // After flight
        int afterCount = path.size() - flightIndex - 1;
        if (afterCount > 1) return false;
        for (int i = flightIndex + 1; i < path.size(); i++) {
            if (path.get(i).getType() == TransportationType.FLIGHT) return false;
        }

        return true;
    }

    // ── Bonus: operatingDays (optional field) ───────────────────────────────
    /**
     * If a List<Integer> field named 'operatingDays' exists on Transportation,
     * consider the transportation active only when it contains the given dayOfWeek.
     * When field is absent or empty, transportation is treated as always active.
     */
    @SuppressWarnings("unchecked")
    private boolean operatesOn(List<Transportation> path, int dayOfWeek) {
        for (Transportation t : path) {
            try {
                var field = Transportation.class.getDeclaredField("operatingDays");
                field.setAccessible(true);
                Object val = field.get(t);
                if (val instanceof List<?> list && !list.isEmpty()) {
                    boolean ok = list.stream().allMatch(o -> (o instanceof Integer i) && i >= 1 && i <= 7);
                    if (!ok) continue; // ignore malformed values; treat as always active
                    boolean runs = ((List<Integer>) list).contains(dayOfWeek);
                    if (!runs) return false;
                }
            } catch (NoSuchFieldException | IllegalAccessException ignored) {
                // Field doesn't exist or not accessible -> treat as always active
            }
        }
        return true;
    }

    private int mapToCaseStudyDow(DayOfWeek dow) {
        return switch (dow) {
            case MONDAY -> 1;
            case TUESDAY -> 2;
            case WEDNESDAY -> 3;
            case THURSDAY -> 4;
            case FRIDAY -> 5;
            case SATURDAY -> 6;
            case SUNDAY -> 7;
        };
    }

    // ── DTO mapping ─────────────────────────────────────────────────────────

    private RouteDtos.Route toDto(List<Transportation> legs) {
        List<RouteDtos.Leg> dtoLegs = legs.stream()
                .map(t -> new RouteDtos.Leg(
                        t.getId(),
                        t.getOrigin().getLocationCode(),
                        t.getDestination().getLocationCode(),
                        t.getType()
                ))
                .toList();
        return new RouteDtos.Route(dtoLegs);
    }
}
