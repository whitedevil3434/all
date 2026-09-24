# Security Spec

1. Data Invariants: Clients can ONLY read data. Clients CANNOT write data directly. All mutations must go through the `/api/commands` endpoint (which runs securely on the backend with Admin SDK).
2. The Dirty Dozen:
   - Any client write to `works` must fail.
   - Any client write to `global_actors` must fail.
3. The Test Runner: We will test that `allow read` is granted to anyone (or participants), and `allow write` is strictly `false`.
