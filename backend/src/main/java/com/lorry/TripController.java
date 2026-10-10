package com.lorry;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripRepository repo;

    public TripController(TripRepository repo) {
        this.repo = repo;
    }


    @GetMapping
    public List<Trip> list(
            @RequestAttribute("uid") Long uid,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "") String q) {

        return status.equals("active")
                ? repo.findByUserIdAndStatusOrderByCreatedAtDesc(
                        uid,
                        "active")
                : repo.search(uid, q);
    }


    @PostMapping
    public Trip create(
            @RequestAttribute("uid") Long uid,
            @RequestBody Trip t) {

        boolean dip = "DIP".equals(t.type);

        if (
                !List.of("Wagon", "Godown").contains(t.pickup)
                || !(dip || "Delivery".equals(t.type))
                || isBlank(t.fromAddr)
                || isBlank(t.toAddr)
                || isBlank(t.lorryNumber)
                || t.tripDate == null
        ) {
            throw bad(
                    "Fill date, lorry number, pickup, type, From and To");
        }


        if (
                dip &&
                (t.trips == null || t.trips < 1)
        ) {
            throw bad(
                    "Enter number of trips");
        }


        if (
                !dip &&
                (t.amount == null || t.amount < 0)
        ) {
            throw bad(
                    "Enter trip amount");
        }


        t.id = null;
        t.userId = uid;
        t.createdAt = System.currentTimeMillis();
        t.status = "active";


        if (dip) {
            t.amount = null;
        } else {
            t.trips = null;
        }


        return repo.save(t);
    }


    /* =====================================================
       PAYMENT DONE
       Active -> History
       ===================================================== */

    @PatchMapping("/{id}/paid")
    public Trip paid(
            @RequestAttribute("uid") Long uid,
            @PathVariable Long id) {

        Trip t = repo.findById(id)
                .filter(x ->
                        x.userId.equals(uid))
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Trip not found"
                        ));


        t.status = "paid";

        return repo.save(t);
    }


    /* =====================================================
       UNDO PAYMENT
       History -> Active
       ===================================================== */

    @PatchMapping("/{id}/undo-paid")
    public Trip undoPaid(
            @RequestAttribute("uid") Long uid,
            @PathVariable Long id) {

        Trip t = repo.findById(id)
                .filter(x ->
                        x.userId.equals(uid))
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Trip not found"
                        ));


        t.status = "active";

        return repo.save(t);
    }


    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }


    private ResponseStatusException bad(String message) {
        return new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                message
        );
    }
}