# Stage 3 Issues Tracker

**Last Updated:** 2025-12-27
**Stage:** Stage 3 - QR Code Generation & Management

---

## Critical Issues

### ISSUE-001: CSRF Vulnerability in State-Changing Endpoints
- **Status:** 🔴 OPEN
- **Severity:** CRITICAL
- **Priority:** P0
- **Component:** API Security
- **Affected Files:**
  - `/src/app/api/qr/settings/route.ts`
  - `/src/app/api/auth/register/route.ts`
  - All future POST/PUT/DELETE endpoints

**Description:**
Application relies solely on httpOnly cookies for authentication without CSRF protection. Attackers can force authenticated users to make unwanted requests.

**Impact:**
- Unauthorized QR settings modifications
- Potential account takeover in future features
- Compliance violations (OWASP Top 10)

**Reproduction:**
1. User logs in to application
2. User visits attacker's malicious website
3. Attacker's site sends: `fetch('https://yourapp.com/api/qr/settings', {method: 'PUT', credentials: 'include', ...})`
4. User's QR settings modified without consent

**Proposed Fix:**
Implement Double Submit Cookie pattern or SameSite cookies

**Estimated Effort:** 4-6 hours
**Blocking:** Production deployment

---

### ISSUE-002: Settings Data Loss on Partial Updates
- **Status:** 🔴 OPEN
- **Severity:** HIGH
- **Priority:** P0
- **Component:** Database Operations
- **Affected Files:**
  - `/src/lib/qrcode.ts` (lines 84-108)

**Description:**
`updateQRCodeSettings()` performs full replacement of settings object instead of partial merge. Updating one setting erases all others.

**Impact:**
- User data loss
- Poor user experience
- Requires re-entering all settings

**Reproduction:**
1. Set QR code with color=#FF0000, backgroundColor=#FFFF00
2. Update ONLY backgroundColor to #00FF00 via settings page
3. Check database: color field is now missing/undefined
4. Dashboard shows default black instead of red

**Proposed Fix:**
Use MongoDB dot notation for partial updates:
```typescript
const updateFields: any = { type, isPremium, updatedAt: new Date() };
Object.keys(settings).forEach(key => {
  updateFields[`settings.${key}`] = settings[key as keyof QRCodeSettings];
});
await collection.updateOne({ userId }, { $set: updateFields });
```

**Estimated Effort:** 1-2 hours
**Blocking:** User customization features

---

### ISSUE-003: Registration Transaction Not Atomic
- **Status:** 🔴 OPEN
- **Severity:** HIGH
- **Priority:** P0
- **Component:** User Registration
- **Affected Files:**
  - `/src/app/api/auth/register/route.ts` (lines 79-101)

**Description:**
User creation and QR code generation are not atomic. If QR code creation fails, user exists in database but client receives error.

**Impact:**
- Orphaned users without QR codes
- "Email already exists" error on retry
- Confused user experience
- Support tickets

**Reproduction:**
1. Start user registration
2. Simulate QR code creation failure (disconnect DB during QR creation)
3. Registration returns 500 error
4. User document exists in database
5. User tries to register again
6. Gets "Email already exists" error

**Proposed Fix:**
Implement rollback mechanism:
```typescript
try {
  const user = await createUser({...});
  try {
    const qrCode = await createQRCode(...);
  } catch (qrError) {
    await deleteUser(userId); // Rollback
    throw qrError;
  }
} catch (error) {
  return 500 error
}
```

**Estimated Effort:** 2-3 hours
**Blocking:** Production deployment

---

### ISSUE-004: Memory Leak in PNG Download
- **Status:** 🔴 OPEN
- **Severity:** HIGH
- **Priority:** P1
- **Component:** QRCodeDisplay Component
- **Affected Files:**
  - `/src/components/QRCodeDisplay/QRCodeDisplay.tsx` (lines 48-86)

**Description:**
`handleDownload()` creates object URL via `URL.createObjectURL()` but only revokes it in success case. If image loading fails, URL is never revoked.

**Impact:**
- Memory leaks with repeated failed downloads
- Browser slowdown over time
- Poor performance on mobile devices

**Reproduction:**
1. Mock image loading failure
2. Click download button multiple times
3. Check browser memory usage (increases each time)
4. Object URLs never cleaned up

**Proposed Fix:**
Add `img.onerror` handler:
```typescript
img.onerror = () => {
  URL.revokeObjectURL(svgUrl);
  toast.error('Failed to download QR code');
};
```

**Estimated Effort:** 1 hour
**Blocking:** Download feature reliability

---

## High Priority Issues

### ISSUE-005: QR Type Input Not Validated
- **Status:** 🔴 OPEN
- **Severity:** MEDIUM
- **Priority:** P1
- **Component:** API Validation
- **Affected Files:**
  - `/src/app/api/qr/settings/route.ts` (lines 46-56)

**Description:**
API checks if `type` exists but doesn't validate it's a valid `QRCodeType` enum value. Accepts arbitrary strings.

**Impact:**
- Database schema pollution
- Premium type blocking bypass
- Future code depending on type enum breaks

**Proposed Fix:**
```typescript
const validTypes: QRCodeType[] = ['standard', 'colored', 'logo', ...];
if (!type || !validTypes.includes(type as QRCodeType)) {
  return 400 error;
}
```

**Estimated Effort:** 30 minutes
**Blocking:** Data integrity

---

### ISSUE-006: Stored XSS Vulnerability in frameText
- **Status:** 🔴 OPEN
- **Severity:** MEDIUM
- **Priority:** P1
- **Component:** Input Sanitization
- **Affected Files:**
  - `/src/app/api/qr/settings/route.ts` (lines 72-95)

**Description:**
`settings.frameText` accepted as raw text without sanitization. Creates stored XSS vulnerability if rendered in future UI.

**Impact:**
- XSS attack vector in Stage 8
- Malicious script execution
- Security compliance violation

**Reproduction:**
1. Send PUT /api/qr/settings with frameText: `<script>alert('XSS')</script>`
2. Value stored in database
3. Future UI renders frameText → XSS executes

**Proposed Fix:**
```typescript
if (settings.frameText) {
  settings.frameText = sanitizeInput(settings.frameText);
  if (settings.frameText.length > 100) {
    return 400 error;
  }
}
```

**Estimated Effort:** 30 minutes
**Blocking:** Stage 8 premium features

---

### ISSUE-007: QR Preview Type Mismatch
- **Status:** 🔴 OPEN
- **Severity:** MEDIUM
- **Priority:** P2
- **Component:** Settings Page UI
- **Affected Files:**
  - `/src/app/qr/settings/page.tsx` (lines 256-268)

**Description:**
Preview shows colored QR when "Standard" type selected if user previously chose custom color.

**Impact:**
- Confusing UX
- Preview doesn't match selection
- Users unsure what they're saving

**Reproduction:**
1. Select "Colored" type, choose red color
2. Change dropdown to "Standard (Black & White)"
3. Preview still shows red QR code

**Proposed Fix:**
Force default colors when standard selected:
```typescript
const previewSettings = selectedType === 'standard'
  ? { color: '#000000', backgroundColor: '#FFFFFF' }
  : { color: selectedColor, backgroundColor: selectedBgColor };
```

**Estimated Effort:** 15 minutes
**Blocking:** UX quality

---

### ISSUE-008: Success Message Timer Race Condition
- **Status:** 🔴 OPEN
- **Severity:** MEDIUM
- **Priority:** P2
- **Component:** Settings Page
- **Affected Files:**
  - `/src/app/qr/settings/page.tsx` (lines 111-126)

**Description:**
Success message uses `setTimeout` without cleanup. Rapid saves cause first timer to clear second message prematurely.

**Impact:**
- Success message disappears too quickly
- Poor user feedback
- Confusion about save status

**Reproduction:**
1. Save settings, see success message
2. Within 2 seconds, save again
3. Second success message disappears immediately (first timer fires)

**Proposed Fix:**
Use useEffect with cleanup:
```typescript
useEffect(() => {
  if (success) {
    const timer = setTimeout(() => setSuccess(false), 3000);
    return () => clearTimeout(timer);
  }
}, [success]);
```

**Estimated Effort:** 15 minutes
**Blocking:** None

---

### ISSUE-009: Color Input Lacks Validation
- **Status:** 🔴 OPEN
- **Severity:** MEDIUM
- **Priority:** P2
- **Component:** Settings Page
- **Affected Files:**
  - `/src/app/qr/settings/page.tsx` (lines 210-217)

**Description:**
Text input for hex colors accepts any string without validation. Causes disconnect between color picker and text input.

**Impact:**
- State out of sync
- Invalid colors saved
- Color picker resets unexpectedly

**Reproduction:**
1. Type "invalid" in hex color text input
2. State updates to "invalid"
3. Color picker shows black (default)
4. Inputs out of sync

**Proposed Fix:**
```typescript
const handleColorChange = (value: string) => {
  if (/^#[0-9A-F]{6}$/i.test(value) || value === '') {
    setSelectedColor(value);
  }
};
```

**Estimated Effort:** 15 minutes
**Blocking:** None

---

### ISSUE-010: Dangling References on QR Deletion
- **Status:** 🔴 OPEN
- **Severity:** MEDIUM
- **Priority:** P2
- **Component:** Database Operations
- **Affected Files:**
  - `/src/lib/qrcode.ts` (lines 136-142)

**Description:**
`deleteQRCode()` removes QR document but doesn't update user document's `qrCodeId` field.

**Impact:**
- Data integrity issues
- User references non-existent QR
- Cleanup complexity increases

**Proposed Fix:**
```typescript
if (result.deletedCount > 0) {
  await usersCollection.updateOne(
    { _id: userObjectId },
    { $unset: { qrCodeId: "" } }
  );
}
```

**Estimated Effort:** 30 minutes
**Blocking:** None (deleteQRCode not currently used)

---

### ISSUE-011: Dashboard QR Fetch Race Condition
- **Status:** 🔴 OPEN
- **Severity:** MEDIUM
- **Priority:** P2
- **Component:** Dashboard Page
- **Affected Files:**
  - `/src/app/dashboard/page.tsx` (lines 43-71)

**Description:**
useEffect fetching QR code doesn't implement cleanup. Navigation during fetch may cause state updates on unmounted component.

**Impact:**
- React warnings in console
- Memory leaks
- Potential state corruption

**Reproduction:**
1. Navigate to dashboard
2. Immediately navigate away (before QR loads)
3. Check console for React warnings

**Proposed Fix:**
Add AbortController:
```typescript
useEffect(() => {
  const controller = new AbortController();
  // ... fetch with signal: controller.signal
  return () => controller.abort();
}, [isAuthenticated]);
```

**Estimated Effort:** 30 minutes
**Blocking:** None (low frequency issue)

---

## Low Priority / Code Quality Issues

### ISSUE-012: QR Library Doesn't Support Premium Features
- **Status:** 🟡 OPEN
- **Severity:** LOW
- **Priority:** P3
- **Component:** QRCodeDisplay Component
- **Affected Files:**
  - `/src/components/QRCodeDisplay/QRCodeDisplay.tsx`

**Description:**
`react-qr-code` library doesn't support logo, gradient, dots style, or frame text defined in settings interface.

**Impact:**
- Premium features won't work in Stage 8
- Interface misleading

**Proposed Fix:**
Replace with `qr-code-styling` library in Stage 8

**Estimated Effort:** 4-6 hours (Stage 8)
**Blocking:** Stage 8 premium features

---

### ISSUE-013: Blocking Alerts Instead of Toasts
- **Status:** 🟡 OPEN
- **Severity:** LOW
- **Priority:** P3
- **Component:** QRCodeDisplay Component
- **Affected Files:**
  - `/src/components/QRCodeDisplay/QRCodeDisplay.tsx` (lines 91-100)

**Description:**
Uses `alert()` for user feedback, which blocks interaction.

**Impact:**
- Poor UX
- Feels dated
- Interrupts user flow

**Proposed Fix:**
Implement toast notification system (react-hot-toast)

**Estimated Effort:** 2 hours
**Blocking:** None

---

### ISSUE-014: Missing Error Feedback in Download
- **Status:** 🟡 OPEN
- **Severity:** LOW
- **Priority:** P3
- **Component:** QRCodeDisplay Component
- **Affected Files:**
  - `/src/components/QRCodeDisplay/QRCodeDisplay.tsx` (lines 48-86)

**Description:**
Download function fails silently if qrRef null or ctx missing.

**Impact:**
- User doesn't know why download failed
- Poor debugging experience

**Proposed Fix:**
Add error toasts for failure cases

**Estimated Effort:** 30 minutes
**Blocking:** None

---

### ISSUE-015: Type Duplication Across Components
- **Status:** 🟡 OPEN
- **Severity:** LOW
- **Priority:** P3
- **Component:** Code Organization
- **Affected Files:**
  - `/src/app/dashboard/page.tsx` (lines 11-27)
  - `/src/app/qr/settings/page.tsx` (lines 19-33)

**Description:**
`QRCodeData` interface manually defined in multiple files instead of shared import.

**Impact:**
- Maintenance burden
- Type drift risk
- Code duplication

**Proposed Fix:**
Create `/src/types/qrcode.ts` and export shared types

**Estimated Effort:** 30 minutes
**Blocking:** None

---

### ISSUE-016: Inline Styles Should Be in SCSS
- **Status:** 🟡 OPEN
- **Severity:** LOW
- **Priority:** P4
- **Component:** Code Quality
- **Affected Files:**
  - `/src/app/dashboard/page.tsx`
  - `/src/app/qr/settings/page.tsx`

**Description:**
Multiple inline style objects used instead of SCSS classes.

**Impact:**
- Inconsistent styling approach
- Harder to maintain
- No style reuse

**Proposed Fix:**
Move all inline styles to SCSS modules

**Estimated Effort:** 1 hour
**Blocking:** None

---

### ISSUE-017: No Retry Mechanism for Failed QR Fetch
- **Status:** 🟡 OPEN
- **Severity:** LOW
- **Priority:** P4
- **Component:** Dashboard Page
- **Affected Files:**
  - `/src/app/dashboard/page.tsx` (lines 113-116)

**Description:**
If QR fetch fails, user must refresh entire page to retry.

**Impact:**
- Minor UX inconvenience
- Extra page load

**Proposed Fix:**
Add retry button in error state

**Estimated Effort:** 30 minutes
**Blocking:** None

---

## Issue Summary

| Severity | Open | In Progress | Resolved | Total |
|----------|------|-------------|----------|-------|
| Critical | 1 | 0 | 0 | 1 |
| High | 3 | 0 | 0 | 3 |
| Medium | 7 | 0 | 0 | 7 |
| Low | 6 | 0 | 0 | 6 |
| **Total** | **17** | **0** | **0** | **17** |

---

## Priority Breakdown

- **P0 (Must Fix Before Production):** 4 issues
- **P1 (Fix Before Stage 4):** 2 issues
- **P2 (Fix When Possible):** 5 issues
- **P3 (Nice to Have):** 4 issues
- **P4 (Low Priority):** 2 issues

---

## Recommended Fix Order

1. **Sprint 1 (Critical):**
   - ISSUE-001: CSRF vulnerability
   - ISSUE-002: Settings data loss
   - ISSUE-003: Registration transaction
   - ISSUE-004: Memory leak

2. **Sprint 2 (High Priority):**
   - ISSUE-005: Type validation
   - ISSUE-006: XSS sanitization
   - ISSUE-007: Preview mismatch
   - ISSUE-008: Timer race condition
   - ISSUE-009: Color validation

3. **Sprint 3 (Medium Priority):**
   - ISSUE-010: Dangling references
   - ISSUE-011: Fetch race condition

4. **Backlog (Low Priority):**
   - ISSUE-013: Toast notifications
   - ISSUE-015: Type centralization
   - ISSUE-014: Error feedback
   - ISSUE-017: Retry mechanism
   - ISSUE-016: SCSS refactor

5. **Stage 8 (Future):**
   - ISSUE-012: Replace QR library

---

**Last Review:** 2025-12-27
**Next Review:** After fixes applied
**Owner:** AI Developer
