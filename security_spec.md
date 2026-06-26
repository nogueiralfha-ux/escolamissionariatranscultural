# Security Spec

## Data Invariants
Waitlist:
- `email` must be a string.
- `createdAt` must be server timestamp.

Enrollment:
- Must have all required fields.
- `createdAt` must be server timestamp.
- `status` must be 'pending' initially.

## Dirty Dozen Payloads
1. Create waitlist with missing email
2. Create waitlist with extra fields
3. Create enrollment with extra fields
4. Read waitlist (should fail)
5. Read enrollment (should fail)

## Test Runner
(skipped for brevity, focus on Rules generation)
