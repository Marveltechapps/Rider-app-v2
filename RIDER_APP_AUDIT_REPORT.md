# Rider App Audit Report: Hardcoded Data & Dashboard Management Gaps

**Codebase:** `rider_app`  
**Focus:** Quick-commerce delivery operations

---

## Section 1: Hardcoded Data

### 1.1 Config & URLs

| Finding | Location | Details |
|---------|----------|---------|
| **Dev fallback port 5002** | `src/api/config.ts:66-70` | `localhost:5002` and `10.0.2.2:5002` hardcoded for dev fallback |
| **Error message with port** | `src/api/config.ts:12`, `src/api/auth.ts:122`, `src/screens/LoginScreen.tsx:92`, `src/components/ErrorBoundary.tsx:47` | "5002" in user-facing error messages |
| **WebSocket reconnect params** | `src/services/websocket.service.ts:58-59` | `maxReconnectAttempts = 5`, `reconnectDelayMs = 2000` |
| **Auth timeouts** | `src/api/auth.ts:61,95,141` | 10000ms and 15000ms request timeouts |

**Recommendation:** Move ports, timeouts, and retry settings to env or a config API. Use env for dev fallback URL.

---

### 1.2 Content – FAQs

| Finding | Location | Details |
|---------|----------|---------|
| **Delivery FAQs (5 topics)** | `src/screens/GenericFAQScreen.tsx:23-148` | Full Q&A for customer not available, wrong address, cancellation, delays, damaged items |
| **Account FAQs (4 topics)** | `src/screens/GenericFAQScreen.tsx:150-248` | Profile verification, KYC, suspension, update profile |
| **App FAQs (2 topics)** | `src/screens/GenericFAQScreen.tsx:251-303` | Login problems, app crashes |
| **Payment FAQs (3 topics)** | `src/screens/PaymentFAQScreen.tsx:26-102` | Payment not received, wrong amount, delays |

**Note:** Only `account-faq-kyc-documents` uses `getFaqByKey()` from the content API. All other FAQs use local `FAQ_DATA`.

**Recommendation:** Load all FAQs from `/api/v1/content/faq/:key` and use local data only as fallback. Add a dashboard FAQ editor.

---

### 1.3 Content – Help & Support

| Finding | Location | Details |
|---------|----------|---------|
| **Support phone** | `src/screens/HelpSupportScreen.tsx:43,127-128` | `1800-123-4567 (24/7)` |
| **Support email** | `src/screens/HelpSupportScreen.tsx:46,145-146` | `support@quickrider.com` |
| **Privacy email** | `src/screens/PrivacyPolicyScreen.tsx:186-188` | `privacy@quickrider.com` |
| **Terms contact** | `src/screens/TermsConditionsScreen.tsx:179-182` | `support@quickrider.com`, `legal@quickrider.com` |
| **Support categories** | `src/screens/ContactSupportScreen.tsx:19-33` | Payment, Delivery, Account, App, Other + categoryToApi mapping |
| **Help topic article counts** | `src/screens/HelpSupportScreen.tsx:203,228,261,288` | 3, 5, 4, 2 hardcoded |

**Recommendation:** Fetch support contact info and categories from a config/content API. Make article counts dynamic or remove.

---

### 1.4 Content – Legal & Policies

| Finding | Location | Details |
|---------|----------|---------|
| **Terms & Conditions** | `src/screens/TermsConditionsScreen.tsx` | Full legal text in code |
| **Privacy Policy** | `src/screens/PrivacyPolicyScreen.tsx` | Full policy text in code |
| **Brand name** | Multiple | "QuickRider" in terms, privacy, FAQs |

**Recommendation:** Serve terms and privacy from API or CMS. Support versioning and locale.

---

### 1.5 Business Rules & Thresholds

| Finding | Location | Details |
|---------|----------|---------|
| **Cash deposit limit** | `src/screens/HomeScreen.tsx:75`, `src/screens/FloatingCashScreen.tsx:77` | `CASH_LIMIT = 2000` (₹) |
| **Deposit max amount** | `src/screens/DepositCashScreen.tsx:28` | `MAX_AMOUNT = 2450` |
| **Cash out limit** | `src/screens/EarningsTodayScreen.tsx:54-55,167` | `MAX_WITHDRAWALS_PER_DAY = 2` |
| **Order list limit** | `src/screens/HomeScreen.tsx:142`, `src/screens/HistoryScreen.tsx:191` | `limit: 50`, `limit: 100` |
| **Payout list limit** | `src/api/payouts.ts:42-43` | `limit = 20` default |

**Recommendation:** Move limits to backend config or feature flags. Allow per-region or per-rider overrides.

---

### 1.6 Mock / Dummy Data

| Finding | Location | Details |
|---------|----------|---------|
| **Documents** | `src/types/documents.ts:17-53` | 5 mock documents (Aadhar, PAN, DL, RC, Insurance) |
| **Payment method** | `src/types/payment.ts:27-37` | Mock bank details (Rajesh Kumar, HDFC) |
| **Order history** | `src/screens/HistoryScreen.tsx:24-198` | 12 dummy orders (ORD240001–ORD240012) |
| **Weekly earnings** | `src/screens/EarningsWeekScreen.tsx:44-52` | `DUMMY_WEEKLY` zeros |
| **Shifts/slots** | `src/screens/SlotChangeScreen.tsx:26-115` | `mockShifts`, `mockBookedShifts` |
| **Floating cash transactions** | `src/screens/FloatingCashScreen.tsx:26-60` | 4 mock transactions |
| **Hub items** | `src/screens/VerifyHubItemsScreen.tsx:36-46` | 8 hardcoded items (Amul Milk, Bread, etc.) |
| **Incentives** | `src/screens/EarningsTodayScreen.tsx:70-98`, `EarningsWeekScreen.tsx:98-127`, `EarningsMonthScreen.tsx:78-126` | Weekend Warrior, Early Bird, Peak Hour Champion |
| **Payout history fallback** | `src/screens/EarningsTodayScreen.tsx:117-139` | 3 fallback payouts |
| **Profile stats** | `src/screens/ProfileScreen.tsx:47-57` | `riderId: 'RDR2024001'`, `floatingCash: 2450`, `lifetimeEarnings: '₹21,680'` |

**Recommendation:** Replace mock data with real APIs. Use mock data only in dev/test behind a flag.

---

### 1.7 Hub / Location Data

| Finding | Location | Details |
|---------|----------|---------|
| **Hub name** | `src/screens/TrainingKitScreen.tsx:155`, `src/screens/AcceptedOrderScreen.tsx:44`, `src/screens/OrderDetailsScreen.tsx:54,88` | "Koramangala Hub" |
| **Hub phone** | `src/screens/AcceptedOrderScreen.tsx:295-296` | `+1234567890` |
| **Dispatch bay** | `src/screens/VerifyHubItemsScreen.tsx:55` | "Dispatch Bay A-12" |
| **Store names in history** | `src/screens/HistoryScreen.tsx:57,122` | "Organic Hub", "Fresh Mart Supermarket", etc. |

**Recommendation:** Hub name, phone, and dispatch bay should come from warehouse/hub API. Store names from order data.

---

### 1.8 Validation Rules

| Finding | Location | Details |
|---------|----------|---------|
| **Aadhar** | `src/screens/AadharUploadScreen.tsx:40,86-87,113` | 12 digits only |
| **PAN** | `src/screens/PANUploadScreen.tsx:40,87-88,114` | 10 chars (e.g. ABCDE1234F) |
| **Driving license** | `src/screens/DrivingLicenseUploadScreen.tsx:40-41,87-88,114` | 15 chars |
| **Phone** | `src/screens/LoginScreen.tsx:51,187` | 10 digits, `maxLength={10}` |
| **OTP** | `src/screens/OTPScreen.tsx:39,54` | Default `+91 98765 43210` |

**Recommendation:** Keep validation in app but align with backend. Consider fetching rules from config for region-specific formats.

---

### 1.9 Document Types & Status

| Finding | Location | Details |
|---------|----------|---------|
| **Document status enum** | `src/types/documents.ts:6` | `'verified' \| 'pending' \| 'expired'` |
| **Document names** | `src/types/documents.ts:19-51`, `src/components/DocumentCard.tsx:34-44` | Aadhar, PAN, Driving License, Vehicle RC, Vehicle Insurance |
| **KYC status** | `src/api/kyc.ts:21` | `'not_started' \| 'pending' \| 'verified' \| 'failed'` |

**Recommendation:** Document types and statuses should come from `getDocumentTypes()` and `getKycStatus()`. `MyDocumentsScreen` still uses `DOCUMENTS` mock; switch to KYC API.

---

### 1.10 Onboarding & Training

| Finding | Location | Details |
|---------|----------|---------|
| **Kit items** | `src/screens/TrainingKitScreen.tsx:44-62` | 2 T-Shirts, Delivery Bag, ID Card |
| **Video duration** | `src/screens/TrainingKitScreen.tsx:76` | 3 seconds simulated completion |
| **Hub for kit** | `src/screens/TrainingKitScreen.tsx:155` | "Koramangala Hub" |

**Recommendation:** Load kit checklist and training video URL from API. Hub from warehouse API.

---

### 1.11 Vehicle Options

| Finding | Location | Details |
|---------|----------|---------|
| **Vehicle types** | `src/screens/VehicleDetailsScreen.tsx:39-42` | Bike, Scooter, EV, Cycle |

**Recommendation:** Fetch vehicle types from config if they vary by region or fleet.

---

### 1.12 Order Status / State

| Finding | Location | Details |
|---------|----------|---------|
| **Order status mapping** | `src/api/orders.ts:132` | `delivered` / `cancelled` / `returned` |
| **Pickup location fallback** | `src/api/orders.ts:127,160` | "Warehouse {code}" or "Hub" |

**Recommendation:** Ensure status values match backend. Pickup labels can be configurable.

---

## Section 2: Dashboard Management Gaps

### 2.1 FAQ & Help Content

| Gap | Current State | Expected |
|-----|---------------|----------|
| **FAQ content** | 11 FAQ topics hardcoded; only KYC uses API | All FAQs editable in dashboard |
| **Help topics** | Static list in DeliveryIssuesScreen, PaymentIssuesScreen, etc. | Topics and order configurable |
| **Article counts** | Hardcoded 3, 5, 4, 2 | Derived from FAQ API or config |

---

### 2.2 Support Configuration

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Support phone** | Hardcoded `1800-123-4567` | Dashboard-configurable |
| **Support email** | Hardcoded `support@quickrider.com` | Dashboard-configurable |
| **Ticket categories** | Hardcoded list and mapping | Categories managed in dashboard |
| **SLA messaging** | "24–48 hours" in UI | Configurable response time |

---

### 2.3 Operational Limits

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Cash limit** | ₹2000 in code | Dashboard-configurable per region |
| **Deposit max** | ₹2450 in code | Dashboard-configurable |
| **Cash out limit** | 2/day in code | Dashboard-configurable |
| **Order list limit** | 50/100 in code | Configurable pagination |

---

### 2.4 Slot / Shift Management

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Available shifts** | Mock data in SlotChangeScreen | API for shifts by warehouse/date |
| **Booked shifts** | Mock data | API for rider's booked shifts |
| **Slot booking** | Local `Alert` only | API to persist bookings |

---

### 2.5 Incentives & Earnings

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Incentives** | Hardcoded (Weekend Warrior, Early Bird, etc.) | Dashboard-configurable campaigns |
| **Incentive amounts** | ₹500, ₹200, ₹300 in code | From incentive API |

---

### 2.6 Hub / Warehouse

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Hub name** | "Koramangala Hub" in code | From warehouse API |
| **Hub phone** | `+1234567890` in code | From warehouse API |
| **Dispatch bay** | "Dispatch Bay A-12" in code | From order or warehouse API |
| **Warehouses** | `getWarehouses()` exists; some fallbacks use hardcoded | Use API everywhere; no hardcoded fallbacks |

---

### 2.7 KYC & Documents

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Document list** | `MyDocumentsScreen` uses `DOCUMENTS` mock | Use `getKycStatus()` and `getDocumentTypes()` |
| **Document types** | Fixed 5 types in code | From KYC API (already supported) |
| **Validation rules** | 12/10/15 chars in code | Configurable or region-specific |

---

### 2.8 Training & Onboarding

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Kit checklist** | Hardcoded 3 items | Dashboard-configurable |
| **Training video** | Simulated 3s completion | Real video URL from API |
| **Kit collection hub** | "Koramangala Hub" | From rider's assigned hub |

---

### 2.9 Legal & Policies

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Terms & Conditions** | Full text in code | CMS or API with versioning |
| **Privacy Policy** | Full text in code | CMS or API with versioning |
| **Contact emails** | Hardcoded | Dashboard-configurable |

---

### 2.10 Verify Hub Items

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Order items** | 8 hardcoded items | From order API |
| **Item verification** | Local state only | API to confirm verification |

---

### 2.11 Payment Flows

| Gap | Current State | Expected |
|-----|---------------|----------|
| **Initial payment** | Mock bank details | From rider profile API |
| **Deposit flow** | Local `Alert`; no real API | Integrate deposit API |
| **Floating cash** | Mock transactions | From cash/transaction API |

---

## Summary of Recommendations

1. **Config API:** Add `/api/v1/config` or similar for limits, support contacts, and feature flags.
2. **Content API:** Use existing `/api/v1/content/faq/:key` for all FAQs; add endpoints for terms, privacy, support config.
3. **Replace mocks:** Wire History, SlotChange, FloatingCash, VerifyHubItems, Profile, and Earnings to real APIs.
4. **KYC integration:** Use `getKycStatus()` and `getDocumentTypes()` in `MyDocumentsScreen` instead of `DOCUMENTS`.
5. **Dashboard features:** Support for FAQs, support config, operational limits, incentives, hub details, legal content, and training/onboarding content.
6. **Env usage:** Use env vars for dev ports, timeouts, and feature flags; avoid hardcoding in error messages.
