# Proposed database schema

Only `users/{uid}` reads are enabled in this scaffold. All other collections below are proposed contracts, not implemented APIs. Use Firestore timestamps for persisted times and integer minor currency units for money (LKR cents). Display schedules in Asia/Colombo; store instants in UTC.

| Collection | Suggested fields | Intended access |
| --- | --- | --- |
| users/{uid} | uid, email, displayName, role: customer/provider/admin, createdAt, updatedAt | Owner get only now; trusted server provisions role |
| providers/{uid} | userId, businessName, categoryIds, district, approvalStatus, ratingSummary | Approved public projection later; server controls approval |
| categories/{id} | name, slug, active, sortOrder | Public active categories later; admin writes |
| services/{id} | providerId, categoryId, title, description, priceMinor, currency: LKR, active | Public active services later; approved owner edits |
| bookings/{id} | customerId, providerId, serviceId, scheduledAt, status, priceMinor, currency, createdAt | Participants only; validated state transitions on server |
| payments/{id} | bookingId, customerId, amountMinor, currency, status, gatewayReference | Server writes only; restricted participant summary |
| reviews/{id} | bookingId, customerId, providerId, rating, comment, createdAt | Verified completed bookings only |
| users/{uid}/favorites/{providerId} | providerId, createdAt | Owner only |
| users/{uid}/notifications/{id} | type, title, body, readAt, createdAt | Owner reads; trusted server creates |
| providers/{uid}/availability/{id} | startAt, endAt, status | Provider writes with validation later |

Initial categories: Home Cleaning, AC Repair, Electrical Services, Plumbing, Painting, Gardening.

Booking lifecycle proposal: pending → accepted → in_progress → completed; pending/accepted → cancelled; pending → rejected. Finalize cancellation and conflict policies before writing handlers. Never trust client prices, payment success, approval state, or roles.

No composite indexes are needed for the scaffold. Add indexes alongside actual query implementations. Define validation rules and emulator tests for each new access path before enabling it. Uploaded assets will need ownership, size, and content-type rules; Storage currently denies all access.
