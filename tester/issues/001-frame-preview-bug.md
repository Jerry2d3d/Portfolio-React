# Issue #001: Frame Does Not Appear in Live Preview

**Status:** Open
**Severity:** Critical
**Priority:** High
**Reported:** 2025-12-27
**Component:** QR Code Preview
**Affects:** Stage 5 - Enhanced QR Customization

---

## Summary

When users enable the "Show frame around QR code" option in the Customize modal, the frame does NOT appear in the live preview. The frame only appears in downloaded PNG files, creating a significant mismatch between what users see and what they receive.

---

## Impact

**User Experience Impact:** HIGH
- Violates the "Changes apply instantly" promise displayed in the modal
- Users think the frame feature is broken or not working
- Creates confusion when downloaded file has frame but preview doesn't
- Reduces trust in other live preview features

**Business Impact:** MEDIUM
- Users may abandon the customization process
- Increases support requests
- Negative perception of product quality

---

## Steps to Reproduce

1. Navigate to http://localhost:3000
2. Enter any URL (e.g., "example.com")
3. Click "Customize" button
4. Click "Frame" tab
5. Check "Show frame around QR code" checkbox
6. Select frame text preset (e.g., "View site")
7. Observe the QR preview on the main page

**Expected Result:**
QR preview should show a frame with padding and text below the QR code, matching the selected frame text.

**Actual Result:**
QR preview remains unchanged. No frame appears. No visual feedback that the setting changed.

---

## Technical Analysis

### Root Cause

The QR code preview uses the `qr-code-styling` library which renders directly to a canvas element. This library does NOT support custom frames with text. The frame rendering logic exists ONLY in the `getCanvasWithFrame()` function (lines 220-276 of page.tsx), which is called exclusively during download operations.

### Code Location

**File:** `/Users/Gerald.Hansen/Repo/qr-code-app/src/app/page.tsx`

**Preview Rendering (Lines 113-174):**
```typescript
useEffect(() => {
  // ... setup code ...

  const options: any = {
    width: 320,
    height: 320,
    data,
    margin: 10,
    qrOptions: { /* ... */ },
    dotsOptions: { /* ... */ },
    backgroundOptions: { /* ... */ },
    cornersSquareOptions: { /* ... */ },
    cornersDotOptions: { /* ... */ },
  };

  // Only QR code options, NO frame logic
  if (!qrCode) {
    const newQR = new QRCodeStyling(options);
    setQrCode(newQR);
    newQR.append(qrRef.current);
  } else {
    qrCode.update(options); // Frame NOT included here
  }
}, [url, settings, qrCode]);
```

**Download Rendering (Lines 220-276):**
```typescript
const getCanvasWithFrame = async (): Promise<HTMLCanvasElement> => {
  // ... code ...

  if (settings.frameEnabled) {
    // Add frame with padding and text
    const padding = 60;
    const textHeight = 40;
    canvas.width = img.width + padding * 2;
    canvas.height = img.height + padding * 2 + textHeight;

    // Background
    ctx.fillStyle = settings.bgTransparent ? '#FFFFFF' : settings.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // QR code
    ctx.drawImage(img, padding, padding);

    // Frame text
    ctx.fillStyle = settings.fgColor;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(settings.frameText, canvas.width / 2, canvas.height - 20);
  }
  // ... return canvas
};
```

### Why It Happens

1. Preview uses `qrCode.update(options)` which only updates QR code properties
2. Frame is a custom feature not supported by qr-code-styling library
3. Frame drawing requires manual canvas manipulation
4. Manual canvas manipulation only happens in `getCanvasWithFrame()`
5. `getCanvasWithFrame()` is only called during downloads, not during preview

---

## Proposed Solution

### Approach 1: Unified Canvas Rendering (Recommended)

Refactor the preview to use the same rendering approach as downloads.

**Changes Required:**

1. Replace preview div with canvas element
2. Create shared rendering function
3. Use rendering function for both preview and download

**Implementation:**

```typescript
// Change JSX (line ~311)
// OLD:
<div className={styles.qrWrapper} ref={qrRef} />

// NEW:
<canvas
  ref={canvasRef}
  className={styles.qrWrapper}
  width={settings.frameEnabled ? 440 : 320}
  height={settings.frameEnabled ? 420 : 320}
/>

// Add new ref
const canvasRef = useRef<HTMLCanvasElement>(null);

// Create shared rendering function
const renderQRToCanvas = async (
  canvas: HTMLCanvasElement,
  includeFrame: boolean = settings.frameEnabled
): Promise<void> => {
  if (!qrCode) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Generate QR as blob
  const blob = await qrCode.getRawData('png');
  const img = new Image();
  const imgUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(imgUrl);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (includeFrame) {
        // Draw with frame
        const padding = 60;
        const textHeight = 40;

        // Background
        ctx.fillStyle = settings.bgTransparent ? '#FFFFFF' : settings.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // QR code
        ctx.drawImage(img, padding, padding);

        // Frame text
        ctx.fillStyle = settings.fgColor;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(settings.frameText, canvas.width / 2, canvas.height - 20);
      } else {
        // No frame
        if (!settings.bgTransparent) {
          ctx.fillStyle = settings.bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
      }

      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(imgUrl);
      reject(new Error('Failed to load QR image'));
    };

    img.src = imgUrl;
  });
};

// Update preview useEffect (line 113)
useEffect(() => {
  if (typeof window === 'undefined' || !QRCodeStyling) return;
  if (!canvasRef.current) return;

  const data = getDisplayUrl();

  // QR options (same as before)
  const options: any = { /* ... */ };

  // Create or update QR code instance
  if (!qrCode) {
    const newQR = new QRCodeStyling(options);
    setQrCode(newQR);
  } else {
    qrCode.update(options);
  }

  // Render to canvas with frame
  if (qrCode && canvasRef.current) {
    renderQRToCanvas(canvasRef.current, settings.frameEnabled)
      .catch(err => console.error('Preview render failed:', err));
  }
}, [url, settings, qrCode]);

// Update download function to use shared renderer
const downloadPNG = async () => {
  if (!qrCode || !canvasRef.current) return;

  try {
    // Create download canvas (higher resolution)
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = settings.frameEnabled ? 440 : 320;
    downloadCanvas.height = settings.frameEnabled ? 420 : 320;

    await renderQRToCanvas(downloadCanvas, settings.frameEnabled);

    downloadCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `markedqr-${timestamp}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download QR code. Please try again.');
  }
};
```

**Benefits:**
- Preview and download use identical rendering
- Frame appears immediately in preview
- DRY principle - no code duplication
- Consistent user experience

**Drawbacks:**
- Requires moderate refactoring
- Slightly more complex code
- Need to test thoroughly

---

### Approach 2: Overlay Frame on Preview (Alternative)

Add a separate div overlay for the frame in preview only.

**Implementation:**

```typescript
// Add frame overlay to JSX
<div className={styles.qrPreviewContainer}>
  <div className={styles.qrWrapper} ref={qrRef} />
  {settings.frameEnabled && (
    <div className={styles.frameOverlay}>
      <span className={styles.frameText} style={{ color: settings.fgColor }}>
        {settings.frameText}
      </span>
    </div>
  )}
</div>
```

**Benefits:**
- Simpler implementation
- Less refactoring required
- Keeps existing QR rendering logic

**Drawbacks:**
- Frame styling might not match download exactly
- CSS-based vs canvas-based rendering differences
- Harder to maintain consistency
- Not a true "what you see is what you get"

---

## Recommendation

**Use Approach 1: Unified Canvas Rendering**

While it requires more refactoring, it ensures perfect consistency between preview and download, which is critical for user trust and the "Changes apply instantly" promise.

---

## Testing Checklist

After implementing fix:
- [ ] Frame appears in preview when enabled
- [ ] Frame text updates in preview when changed
- [ ] Frame color matches foreground color
- [ ] Preview matches downloaded PNG exactly
- [ ] Performance is acceptable (no lag when changing settings)
- [ ] Canvas resizes correctly when frame toggled
- [ ] Transparent backgrounds work with frame
- [ ] Logo works with frame
- [ ] All QR customizations still work
- [ ] Download PNG still works
- [ ] Download SVG still works (frame may not apply to SVG)
- [ ] No console errors
- [ ] Memory leaks checked (canvas cleanup)

---

## Related Issues

- None (first issue reported)

---

## Notes

- SVG downloads may not support frames (library limitation)
- Consider adding frame color customization in future
- Frame text customization (custom input) could be valuable feature
- Frame padding/size customization could enhance flexibility

---

**Issue Owner:** React Testing Specialist
**Assigned To:** Development Team
**Target Resolution:** Before Stage 5 production deployment
