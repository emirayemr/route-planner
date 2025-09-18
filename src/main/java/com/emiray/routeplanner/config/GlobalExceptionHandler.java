/* ──────────────────────────────────────────────────────────────────────────
 * Title: GlobalExceptionHandler
 * Purpose: Map common framework/domain exceptions to RFC 7807 Problem Detail
 *          responses for a consistent API error contract.
 * Notes: Keeps controllers lean; adds minimal, safe metadata for debugging.
 * ────────────────────────────────────────────────────────────────────────── */
package com.emiray.routeplanner.config;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Validation (DTO @Valid) ─────────────────────────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        ProblemDetail pd = problem(HttpStatus.BAD_REQUEST,
                "Validation failed", "validation-error");
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(err -> {
            String field = (err instanceof FieldError fe) ? fe.getField() : err.getObjectName();
            errors.put(field, err.getDefaultMessage());
        });
        pd.setProperty("errors", errors);
        return enrich(pd, ex);
    }

    // ── Validation (method-level constraints) ───────────────────────────────
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ProblemDetail handleConstraintViolation(ConstraintViolationException ex) {
        ProblemDetail pd = problem(HttpStatus.BAD_REQUEST,
                "Constraint violation", "constraint-violation");
        pd.setProperty("violations", ex.getConstraintViolations().stream()
                .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                .toList());
        return enrich(pd, ex);
    }

    // ── Persistence integrity (e.g., unique index) ─────────────────────────
    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ProblemDetail handleDataIntegrity(DataIntegrityViolationException ex) {
        ProblemDetail pd = problem(HttpStatus.CONFLICT,
                "Data integrity violation", "data-integrity");
        return enrich(pd, ex);
    }

    // ── Programmatic HTTP errors from services/controllers ──────────────────
    @ExceptionHandler(ResponseStatusException.class)
    public ProblemDetail handleResponseStatus(ResponseStatusException ex) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(ex.getStatusCode(),
                ex.getReason() != null ? ex.getReason() : "Request failed");
        pd.setType(type("http-" + ex.getStatusCode().value()));
        return enrich(pd, ex);
    }

    // ── Fallback (last resort) ──────────────────────────────────────────────
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ProblemDetail handleGeneric(Exception ex) {
        ProblemDetail pd = problem(HttpStatus.INTERNAL_SERVER_ERROR,
                "Unexpected error", "unexpected");
        return enrich(pd, ex);
    }

    // ── Helpers ─────────────────────────────────────────────────────────────
    /** Create a ProblemDetail with a consistent type URI. */
    private static ProblemDetail problem(HttpStatus status, String detail, String slug) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setType(type(slug));
        return pd;
    }

    /** Standardize type URI base. */
    private static URI type(String slug) {
        return URI.create("https://example.com/problems/" + slug);
    }

    /** Add minimal, non-sensitive diagnostics. */
    private static ProblemDetail enrich(ProblemDetail pd, Exception ex) {
        pd.setProperty("timestamp", OffsetDateTime.now().toString());
        pd.setProperty("exception", ex.getClass().getSimpleName());
        return pd;
    }
}
