# Security Specification - LegisPanamá Community

## 1. Data Invariants
- A `Report` must have a valid `authorId` matching the request user.
- A `Comment` must be attached to an existing `Report`.
- A user can only vote once per report for each type (like/dislike/fake).
- Deletion of a report is allowed if:
  - The requester is the author.
  - `fakeReportCount` >= 50.
  - (Internal logic for secret code 01020 is handled via client-side request, for the rules I'll allow a specific 'admin' or just the author. Actually, to truly implement the "secret code deletes" via Rules, I'd need a specific field or a special flag. For this app scope, I'll allow deletion if the user is the author OR if they have a special bypass. Since I can't easily verify the secret code 01020 inside Rules (unless it's hashed or something), I'll stick to a slightly more open delete rule for demonstration if the specific condition of "fake report" is met, and for the secret code, I'll maybe allow it if they set a specific field. No, let's keep it simple: allow delete if author OR if fakeReportCount >= 50.)

## 2. Dirty Dozen Payloads (Rejection Tests)
1. Creating a report with a different `authorId`.
2. Creating a report with a fake `createdAt` (not server timestamp).
3. Incrementing `likesCount` by more than 1.
4. Deleting a report where `fakeReportCount` < 50 and user is not author.
5. Creating a comment on a non-existent report.
6. Submitting a report with text > 5000 characters (resource exhaustion).
7. Spoofing `authorName` in a comment.
8. Modifying `fakeReportCount` directly without an associated `Vote` document (if I were using getAfter, but for now I'll use a field check).
9. Path poisoning: injecting special chars in document IDs.
10. Updating a terminal state (if we had one, like 'closed').
11. Reading PII (not applicable here yet, but good to keep in mind).
12. Blanket list queries without owner filters (though here list is public).

## 3. Test Runner
We will verify these in `firestore.rules`.
