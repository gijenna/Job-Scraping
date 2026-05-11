## Wipe Connect candidate data

Delete in this order (children first, parent last) so nothing is orphaned. All other tables (brand_reps sessions, experts, afterparty_*, admin, brands, taxonomies, email templates, schema) are untouched.

### Current row counts
- candidates: 7
- brand_lead_responses: 0
- candidate_starred_brands: 4
- brand_starred_attendee: 0
- connections: 1
- connect_notes: 3
- filter_logs: 141
- user_sessions where subject_type='candidate': 11

### Deletion sequence (single SQL transaction)
1. `DELETE FROM brand_lead_responses` (0)
2. `DELETE FROM candidate_starred_brands` (4)
3. `DELETE FROM brand_starred_attendee` (0, brand-side stars on candidates)
4. `DELETE FROM connections` (1) — all rows are candidate-owned
5. `DELETE FROM connect_notes` (3) — Connect notes only; afterparty has its own tables
6. `DELETE FROM filter_logs` (141) — candidate-related filter activity
7. `DELETE FROM user_sessions WHERE subject_type = 'candidate'` (11) — leaves brand_rep + expert sessions intact
8. `DELETE FROM candidates` (7) — table preserved, just emptied

### Not touched
- `brand_reps`, `industry_experts`, `event_map_brands`, `event_settings`
- All `afterparty_*` tables
- `user_sessions` rows where `subject_type` in ('brand_rep') and any expert sessions
- Auth users, admin tables, email templates, taxonomies, storage buckets

### Verification after run
- Re-count all 8 tables above (candidates = 0, candidate sessions = 0, others = 0)
- Spot check: `SELECT count(*) FROM user_sessions WHERE subject_type='brand_rep'` is unchanged
- Spot check: `SELECT count(*) FROM industry_experts` and `afterparty_attendees` unchanged

Approve and I will execute the deletes via the data tool and report final counts.