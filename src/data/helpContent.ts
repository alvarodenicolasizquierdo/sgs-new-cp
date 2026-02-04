// Context-aware help content mapped to screens, objects, and roles
// Knowledge extracted from TU Sainsbury's documentation and training materials

export interface HelpItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: 'getting-started' | 'testing' | 'suppliers' | 'inspections' | 'reports' | 'general' | 'styles' | 'components' | 'gsw';
}

export interface ContextualHelp {
  route: string;
  title: string;
  description: string;
  commonQuestions: HelpItem[];
  tips: string[];
}

export interface ElementHelp {
  selector: string;
  title: string;
  description: string;
  learnMoreId?: string;
}

// ============================================
// COMPREHENSIVE HELP DATABASE
// Sourced from TU Sainsbury's Documentation
// ============================================

export const helpDatabase: HelpItem[] = [
  // ========================================
  // GETTING STARTED
  // ========================================
  {
    id: 'gs-1',
    question: 'How do I log in for the first time?',
    answer: `**First Time Login:**
1. Navigate to the login page
2. Click **"New User Register"**
3. Complete all required fields:
   - User ID (choose a unique username)
   - Email Address (your business email)
   - Password (must meet security requirements)
   - Supplier Name (select from dropdown)
   - Role (Supplier, Lab, or Admin)
4. Submit and wait for administrator approval
5. You'll receive an email confirmation once approved

⚠️ **Important:** Access will not be granted without completing system training. Contact your technologist to arrange training.`,
    keywords: ['login', 'first', 'register', 'new user', 'account', 'access'],
    category: 'getting-started'
  },
  {
    id: 'gs-2',
    question: 'What are the password requirements?',
    answer: `**Password Requirements:**
- Length: 12-64 characters
- Must include:
  - One or more uppercase letters
  - One or more lowercase letters
  - More than one number
  - More than one special symbol
- Passwords expire every **3 months**

**Account Lockout:** After 10 consecutive failed login attempts, your account will be locked. Use "Forgot Password" to reset.`,
    keywords: ['password', 'requirements', 'security', 'reset', 'forgot', 'locked'],
    category: 'getting-started'
  },
  {
    id: 'gs-3',
    question: 'What is the TU system and why do I need it?',
    answer: `The TU Online System is a **mandatory tool** for suppliers to gain technical approval for every apparel product. 

**Key Benefits:**
- All communication in one central location (no emails required)
- System enforces correct submission order (Base → Bulk → Product)
- Build an approved component library for reuse
- Direct testing requests to accredited laboratories
- Clear audit trail of all actions

**Workflow-Centric Design:** The system is designed as an inbox-driven portal where you log in and see YOUR pending tasks immediately, rather than navigating through libraries.`,
    keywords: ['tu', 'system', 'purpose', 'why', 'benefit', 'portal', 'workflow'],
    category: 'getting-started'
  },
  {
    id: 'gs-4',
    question: 'How do I navigate the inbox system?',
    answer: `**Inbox-Based Workflow:**

Unlike library-based systems, this portal uses an **inbox model**:
- Log in to see YOUR 5 pending tasks immediately
- Tasks are routed to specific, named individuals (not team queues)
- Each task shows:
  - What action is required
  - Who submitted it
  - When it's due
  
**Key Areas:**
- **My Inbox:** Tasks awaiting your action
- **Submitted:** Items you've sent for review
- **Completed:** Finished tasks for reference`,
    keywords: ['inbox', 'navigate', 'tasks', 'pending', 'workflow', 'queue'],
    category: 'getting-started'
  },

  // ========================================
  // STYLES
  // ========================================
  {
    id: 'st-1',
    question: 'How do I create a new style?',
    answer: `**Creating a New Style:**

1. Click **"New Style"** from the home page sidebar
2. Complete Style Header Information (all * fields mandatory):
   
| Field | Required | Description |
|-------|----------|-------------|
| Factory | Yes | Select from your account's factories |
| Season | Yes | SS25, AW25, etc. |
| Design Style Ref | Yes | Your unique style number |
| Product Colour | Yes | Main color of product |
| Technologist | Yes | Select your assigned technologist |
| Country of Origin | Yes | Manufacturing country |
| Style Description | Yes | e.g., "Cotton Crew Neck T-Shirt" |

3. Click **"Next"** and save your progress
4. Continue to add Care Labels, Images, and Components`,
    keywords: ['create', 'new', 'style', 'add', 'start', 'header'],
    category: 'styles'
  },
  {
    id: 'st-2',
    question: 'What are the style status values?',
    answer: `**Style Status Values:**

| Status | Description |
|--------|-------------|
| **PENDING** | Style being created/edited by supplier |
| **SUBMITTED** | Sent to buyer for review |
| **APPROVED** | Approved by buyer or self-approving supplier |
| **DEACTIVATED** | Temporarily deactivated (can be reactivated) |
| **CANCELLED** | Cancelled by buyer |

**Key Rules:**
- Only suppliers can edit when status is PENDING
- Buyers can only approve/return, not modify data
- Deactivated products can be reactivated to PENDING status`,
    keywords: ['status', 'style', 'pending', 'submitted', 'approved', 'cancelled'],
    category: 'styles'
  },
  {
    id: 'st-3',
    question: 'What are style stages and how do they progress?',
    answer: `**Style Stages (Testing Lifecycle):**

| Stage | Description | Prerequisites |
|-------|-------------|---------------|
| **Base** | Initial component testing phase | Style created, components linked |
| **Base Approved** | All base testing completed | All components BASE tested and approved |
| **Bulk** | Production fabric testing | Base Approved stage reached |
| **Bulk Approved** | Production testing done | All BULK testing approved |
| **Approved** | Ready for production | Bulk Approved + Care labels + GSW uploaded |

**Flow:** Base → Base Approved → Bulk → Bulk Approved → Final Approval`,
    keywords: ['stage', 'base', 'bulk', 'approved', 'progression', 'lifecycle'],
    category: 'styles'
  },
  {
    id: 'st-4',
    question: 'How do I add care labels to a style?',
    answer: `**Adding Care Labels:**

**Step 1: Add Care Symbols**
1. Click **"Add Symbols"** button
2. Browse available care symbols in popup
3. Click "Select" for each required symbol
4. Use green **+** to add more, red **X** to remove

**Step 2: Add Care Wording**
1. Click **"Add Wording"** button
2. Select relevant care instruction phrases
3. Click **+** to add each phrase
4. Click OK when complete

**Step 3: Generate Translations**
Click the **"Translate"** icon to automatically translate care wording into required languages (French, German, Spanish, etc.)`,
    keywords: ['care', 'label', 'symbol', 'wording', 'translate', 'wash'],
    category: 'styles'
  },
  {
    id: 'st-5',
    question: 'How do I add images to a style?',
    answer: `**Adding Style Images:**

⚠️ **Important:** Save product photos to your computer BEFORE starting the upload.

1. Click **"Add Images"** button
2. In the popup:
   - **File:** Choose your saved image
   - **Type:** Select "Image" from dropdown
   - **Description:** Enter product description (e.g., "Sweatshirt Front")
3. Click **"Upload"**
4. Image appears on the page
5. To add more, click **"Add Images"** again
6. Click **"Next"** to proceed

Recommended images: Front view, Back view, Detail shots, Labels and tags`,
    keywords: ['image', 'photo', 'upload', 'picture', 'add'],
    category: 'styles'
  },
  {
    id: 'st-6',
    question: 'How do I submit a style for approval?',
    answer: `**Submitting for Base Approval:**

**Pre-Submission Checklist:**
✅ All mandatory style information completed
✅ Style image uploaded
✅ Care symbols and wording added
✅ All components added with specifications
✅ All base tests PASSED
✅ Fabric hanger generated

**Steps:**
1. Review entire style sheet for accuracy
2. Click **"Submit to Sainsburys"** button (top right)
3. Confirm in popup
4. Style moves to "Retailer Inbox"
5. Technologist receives notification
6. Wait for approval (typically 3 working days)

**What Happens Next:**
- **Approve:** Proceed to bulk testing
- **Return with Comments:** Make changes and resubmit
- **Reject:** Major issues require complete review`,
    keywords: ['submit', 'approval', 'style', 'retailer', 'checklist'],
    category: 'styles'
  },

  // ========================================
  // COMPONENTS
  // ========================================
  {
    id: 'cp-1',
    question: 'What components need to be added?',
    answer: `**Component Submission Guidelines:**

- All main components **over 10% of garment area** require testing
- Both main fabric AND lining must be tested if each is >10%
- Don't add components you don't need to test
- Each component requires its own specification sheet

**Component Types:**
- Main Fabric
- Lining
- Trims (buttons, zippers, labels)
- Accessories`,
    keywords: ['component', 'fabric', 'material', '10%', 'add', 'required'],
    category: 'components'
  },
  {
    id: 'cp-2',
    question: 'How do I add a new component?',
    answer: `**Adding a New Component:**

1. Click **"Add New Component"**
2. Complete component details:
   - Component Type (Main Fabric, Lining, Trim, etc.)
   - Fabric Description
   - Weight (GSM)
   - Width
   - Supplier Reference
   - Fiber Composition (e.g., "65% Polyester, 35% Cotton")
   - Dye Type
   - Finish Type
3. Upload fabric specification sheet (PDF)
4. Save component

**Validation:** Total fiber composition must equal 100%`,
    keywords: ['add', 'new', 'component', 'create', 'fabric', 'specification'],
    category: 'components'
  },
  {
    id: 'cp-3',
    question: 'How do I reuse an approved component?',
    answer: `**Using Previously Approved Components (Base Library):**

1. Click **"Search Base Library"**
2. Search by:
   - Supplier Reference
   - Fabric Type
   - Season
3. Select approved component from results
4. Link to current style

✨ **Benefit:** No retesting required if base approval is still valid (6 months)

**N:M Relationship:** When you link Component X to Style A, then later link the same Component X to Style B, **both styles reference the same material record**. If testing is updated for Component X, it affects all linked styles.`,
    keywords: ['reuse', 'approved', 'component', 'library', 'link', 'existing'],
    category: 'components'
  },
  {
    id: 'cp-4',
    question: 'How long are base test results valid?',
    answer: `**Base Test Validity:**

⚠️ Base fabric test reports are valid for **6 months** from issue date.

After 6 months, retesting is required.

**Expiry Calculation:**
\`ExpiryDate = BaseApprovedDate + TestExpiryMonths\`

Some suppliers may have custom expiry periods configured in their account settings.

**Tip:** Use the component library to reuse approved materials within their validity period and prevent overtesting.`,
    keywords: ['valid', 'validity', 'expire', 'expiry', '6 months', 'retest'],
    category: 'components'
  },

  // ========================================
  // TESTING & TRFs
  // ========================================
  {
    id: 't-1',
    question: 'What is a TRF (Test Request Form)?',
    answer: `**Test Request Form (TRF):**

A TRF is the formal document that initiates testing at an accredited laboratory.

**The TRF Process:**
1. Generate TRF in system for each component
2. Print the TRF document
3. Send physical sample + printed TRF to laboratory
4. Lab performs testing and uploads results
5. Technologist reviews and approves

**Key Points:**
- Each component requiring testing needs its own TRF
- TRF is **locked after submission** (cannot be edited)
- Request ID is generated for tracking`,
    keywords: ['trf', 'test request', 'form', 'what is', 'generate', 'print'],
    category: 'testing'
  },
  {
    id: 't-2',
    question: 'What are the different testing levels?',
    answer: `**Testing Levels (Two-Phase Lifecycle):**

**BASE Testing Phase:**
- Initial material/component testing
- Tests: composition, physical properties
- Approval: Fabric Technologist
- Result: Component.BaseStatus → Approved/Rejected

**BULK Testing Phase:**
- Production-level testing on actual manufacturing batches
- Required for EACH color in production
- Self-approving suppliers may approve their own BULK tests
- Result: Component.BulkStatus → Approved/Rejected

**GARMENT Testing:**
- Finished product tests (dimensional stability, etc.)
- Final stage before Gold Seal submission`,
    keywords: ['testing', 'level', 'base', 'bulk', 'garment', 'phase'],
    category: 'testing'
  },
  {
    id: 't-3',
    question: 'How do I create a base test request?',
    answer: `**Creating Base Test Request:**

1. Navigate to Components section of style sheet
2. For each component requiring testing, click **"Create Test Request"**
3. Select:
   - **Laboratory:** Choose from accredited labs
   - **Test Type:**
     - Woven Physical
     - Weft Knit Physical
     - Warp Knit Physical
     - Knitwear Physical
   - **Care Symbol:** SY33 (recommended) or agreed care code
   - **Bill To/Payee:** Who will pay for testing
4. Click **"Generate Request"**
5. Request ID is created
6. Click **"Print TRF"**
7. Send fabric sample + printed TRF to laboratory`,
    keywords: ['create', 'base', 'test', 'request', 'generate', 'lab'],
    category: 'testing'
  },
  {
    id: 't-4',
    question: 'How do I create a bulk test request?',
    answer: `**Creating Bulk Test Request:**

⚠️ Prerequisites: Base testing must be approved first.

1. Click **"Create Bulk Test"** for component
2. Select:
   - **Laboratory:** Accredited lab
   - **Test Type:** Physical + Colour Fastness
   - **Color:** Specify exact color name
3. Generate Request ID and print TRF
4. Send bulk production sample + TRF to lab

**Important:** Bulk testing is required for **EACH color** in production. If you have 5 colors, you need 5 separate bulk tests.

After results are uploaded, click **"Link Bulk to Base"** to validate bulk sample against approved base fabric.`,
    keywords: ['bulk', 'test', 'request', 'color', 'production', 'create'],
    category: 'testing'
  },
  {
    id: 't-5',
    question: 'How do I upload existing test reports?',
    answer: `**Uploading Existing Test Reports:**

If you already have a valid test report from an accredited lab:

1. Navigate to component on style sheet
2. Click **"Upload Existing Report"**
3. Enter:
   - Laboratory name
   - Report number
   - Test date
   - Report status (Pass/Fail)
4. Upload PDF report file
5. Save

**Link-and-Amend Pattern:** When you link an existing report, you're not doing a one-time import. If the source test is updated, the linked styles are affected too.

This prevents overtesting when the same fabric is used across multiple products.`,
    keywords: ['upload', 'existing', 'report', 'link', 'reuse', 'own'],
    category: 'testing'
  },
  {
    id: 't-6',
    question: 'What test types are available?',
    answer: `**Available Test Types:**

**Base Testing:**
- Woven Physical
- Weft Knit Physical
- Warp Knit Physical
- Knitwear Physical
- Schoolwear variants

**Bulk Testing:**
- All base types + Colour Fastness
- Required for each production color

**Reference Manuals:**
- **GSA011-V2:** General Standard for Fabric Testing Performance
- **MAN002-V1:** Tu Clothing Fabric Manual
- **MAN003-V2:** Manual for Tu Accessories Testing

Contact your technologist for specific test requirements.`,
    keywords: ['test', 'type', 'woven', 'knit', 'physical', 'color'],
    category: 'testing'
  },
  {
    id: 't-7',
    question: 'What does each TRF status mean?',
    answer: `**TRF Status Values:**

| Status | Description |
|--------|-------------|
| **Draft** | Initial creation, not yet submitted |
| **Submitted** | Sent to lab for processing |
| **Sample Received** | Lab confirmed sample arrival |
| **In Testing** | Active testing in progress |
| **Pending Review** | Results ready for technologist review |
| **Approved** | Tests passed and approved |
| **Rejected** | Tests failed, retest may be required |

**Workflow:** Draft → Submitted → Sample Received → In Testing → Pending Review → Approved/Rejected`,
    keywords: ['status', 'trf', 'draft', 'submitted', 'approved', 'rejected'],
    category: 'testing'
  },
  {
    id: 't-8',
    question: 'How are SLA deadlines calculated?',
    answer: `**SLA Deadlines:**

Deadlines are calculated from the sample received date:
- **Base testing:** 5 business days
- **Bulk testing:** 7 business days
- **Garment testing:** 10 business days
- **Rush orders:** 50% reduction

**SLA Indicators:**
- 🟢 Green: On track
- 🟡 Yellow: At risk (<24 hours remaining)
- 🔴 Red: Overdue

Rush orders incur additional fees but receive expedited processing.`,
    keywords: ['sla', 'deadline', 'timeline', 'days', 'rush', 'calculate'],
    category: 'testing'
  },
  {
    id: 't-9',
    question: 'Who approves tests?',
    answer: `**Test Approval Authority:**

**BASE Tests:**
- Approved by: Sainsbury's user with \`FabricTech=1\` permission
- Cannot self-approve (unless special permission)

**BULK Tests:**
- Approved by: Sainsbury's Fabric Tech OR
- Self-approving suppliers with \`SelfApprovers\` permission

**Garment Tests:**
- Approved by: User with \`GarmentTech=1\` permission
- Required for Gold Seal submission

**Override:** Buyers can override approval with comments if parts are missing/unapproved.`,
    keywords: ['approve', 'approval', 'authority', 'permission', 'fabric tech'],
    category: 'testing'
  },

  // ========================================
  // GOLD SEAL WORKBOOK (GSW)
  // ========================================
  {
    id: 'gsw-1',
    question: 'What is Gold Seal (GSW)?',
    answer: `**Gold Seal Workbook (GSW):**

Gold Seal is the **final approval stage** for production garments. It confirms the garment matches all approved specifications.

**Requirements:**
✅ All components BULK approved
✅ Style status = 'Approved'
✅ Garment Tech approval
✅ GSW workbook uploaded
✅ Garment photos submitted

**When all requirements are met:**
→ Golden Tick is awarded
→ Style is cleared for production`,
    keywords: ['gold seal', 'gsw', 'workbook', 'final', 'approval', 'golden tick'],
    category: 'gsw'
  },
  {
    id: 'gsw-2',
    question: 'How do I submit a Gold Seal Workbook?',
    answer: `**Submitting GSW:**

1. Complete Gold Seal Workbook (Excel template)
2. Navigate to "Gold Seal" section of style
3. Click **"Upload GSW"**
4. Upload completed workbook
5. Add garment photos showing:
   - Front view
   - Back view
   - Detail shots
   - Labels and tags
6. Submit to Sainsbury's Garment Technologist
7. Wait for final approval (3 working days)

**Prerequisites:** All BULK testing must be approved before GSW submission.`,
    keywords: ['submit', 'gsw', 'upload', 'gold seal', 'workbook', 'how to'],
    category: 'gsw'
  },
  {
    id: 'gsw-3',
    question: 'What is the Fabric Hanger?',
    answer: `**Generating Fabric Hanger:**

The Fabric Hanger is a summary document generated after all base tests pass.

**Prerequisites (Hanger Checklist):**
✅ All components added
✅ All fiber compositions complete
✅ All base tests passed
✅ Care symbols and wording complete
✅ All specifications uploaded

**Steps:**
1. Navigate to "Fabric Hanger" section
2. Review hanger checklist
3. Click **"Generate Fabric Hanger"**
4. System creates PDF hanger
5. Download and review

The Fabric Hanger is required before submitting for Base Approval.`,
    keywords: ['fabric', 'hanger', 'generate', 'pdf', 'checklist'],
    category: 'gsw'
  },

  // ========================================
  // SUPPLIERS
  // ========================================
  {
    id: 's-1',
    question: 'How is supplier risk calculated?',
    answer: `**Supplier Risk Score Calculation:**

Risk scores combine multiple factors:
- Test failure rate (40%)
- Inspection results (30%)
- Delivery performance (20%)
- Compliance status (10%)

Scores update weekly. View details on the Risk Assessment page.

**Risk Levels:**
- 🟢 Low Risk: Score 80-100
- 🟡 Medium Risk: Score 50-79
- 🔴 High Risk: Score <50`,
    keywords: ['risk', 'score', 'supplier', 'calculate', 'rating'],
    category: 'suppliers'
  },
  {
    id: 's-2',
    question: 'What is self-approval and how does it work?',
    answer: `**Self-Approval Permissions:**

Some suppliers are granted self-approval rights based on training and track record.

**Self-Approval Types:**

| Type | Effect |
|------|--------|
| **Style Sheets** | Approve own workbooks without Sainsbury's review |
| **Failed Bulk** | Approve styles that failed BULK testing |

**Requirements:**
- Training status must be "Complete"
- "Style Sheets" permission required before "Failed Bulk"
- Self-approver level (1-3) determines authority

Check your permissions in Settings > Account.`,
    keywords: ['self', 'approval', 'permission', 'self-approver', 'own'],
    category: 'suppliers'
  },
  {
    id: 's-3',
    question: 'How do I add a new factory?',
    answer: `**Adding a Factory:**

Factories must be linked to your supplier account before creating styles.

1. Navigate to Settings > Factories
2. Click **"Add Factory"**
3. Enter factory details:
   - Factory Name
   - Address
   - Country
   - Contact Information
   - Certifications
4. Submit for approval

Once approved, the factory appears in your Factory dropdown when creating styles.`,
    keywords: ['factory', 'add', 'new', 'create', 'location'],
    category: 'suppliers'
  },
  {
    id: 's-4',
    question: 'What do the supplier compliance badges mean?',
    answer: `**Compliance Badge Colors:**

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 Green | Compliant | All certifications current |
| 🟡 Yellow | Expiring | Certifications expire within 30 days |
| 🔴 Red | Non-Compliant | Expired or missing required certifications |

**Actions Required:**
- Yellow: Renew certifications before expiry
- Red: Contact your technologist immediately

Non-compliant suppliers may be blocked from submitting new styles.`,
    keywords: ['compliance', 'badge', 'certification', 'green', 'red', 'yellow'],
    category: 'suppliers'
  },

  // ========================================
  // INSPECTIONS
  // ========================================
  {
    id: 'i-1',
    question: 'What inspection types are available?',
    answer: `**Inspection Types:**

| Type | When | Purpose |
|------|------|---------|
| **Pre-Production** | Before manufacturing | Verify specifications ready |
| **During Production** | While goods made | Quality check mid-process |
| **Final Random** | Before shipment | AQL sampling check |
| **Full Inspection** | As required | 100% product check |

Each type has specific AQL standards and checkpoints.`,
    keywords: ['inspection', 'type', 'pre-production', 'final', 'random', 'aql'],
    category: 'inspections'
  },
  {
    id: 'i-2',
    question: 'How do I schedule an inspection?',
    answer: `**Scheduling an Inspection:**

1. Navigate to Inspections
2. Click **"Schedule Inspection"**
3. Select:
   - Factory
   - Date
   - Inspection Type
   - Assign Inspector
4. System checks inspector availability
5. Confirmation emails sent to all parties

**Rescheduling:** Contact your coordinator at least 48 hours before the scheduled date.`,
    keywords: ['schedule', 'inspection', 'book', 'inspector', 'date'],
    category: 'inspections'
  },

  // ========================================
  // REPORTS & ANALYTICS
  // ========================================
  {
    id: 'r-1',
    question: 'How do I export report data?',
    answer: `**Exporting Report Data:**

1. Navigate to any report page
2. Click **"Export"** button
3. Choose format:
   - CSV (for spreadsheet analysis)
   - PDF (for sharing/printing)
4. Customize columns before export if needed

**Scheduled Exports:**
Set up automated exports in Settings > Reports > Scheduled Exports.`,
    keywords: ['export', 'report', 'csv', 'pdf', 'download', 'data'],
    category: 'reports'
  },
  {
    id: 'r-2',
    question: 'Can I create custom reports?',
    answer: `**Creating Custom Reports:**

1. Go to Insight > Custom Reports
2. Click **"New Report"**
3. Select data source (tests, inspections, suppliers)
4. Add filters and columns
5. Save as template to reuse
6. Share with team via share button

Custom reports can include charts and be scheduled for regular generation.`,
    keywords: ['custom', 'report', 'create', 'template', 'insight'],
    category: 'reports'
  },

  // ========================================
  // GENERAL / SETTINGS
  // ========================================
  {
    id: 'g-1',
    question: 'How do I change notification settings?',
    answer: `**Notification Settings:**

Go to Settings > Notifications to customize:
- **Email alerts:** Test completions, inspection results
- **In-app notifications:** Real-time updates
- **SLA warnings:** Overdue deadline alerts

Each notification type can be enabled/disabled individually.`,
    keywords: ['notification', 'settings', 'email', 'alert', 'preferences'],
    category: 'general'
  },
  {
    id: 'g-2',
    question: 'How do I add team members?',
    answer: `**Adding Team Members:**

1. Navigate to Settings > Users
2. Click **"Invite User"**
3. Enter:
   - Email address
   - Role (Admin, Manager, Viewer)
   - Permissions
4. Send invitation

**User Levels:**
- **Reader:** View only
- **Editor:** Create and edit
- **Superuser:** Full access + user management`,
    keywords: ['team', 'member', 'invite', 'user', 'add', 'role'],
    category: 'general'
  },
  {
    id: 'g-3',
    question: 'How do I change my password?',
    answer: `**Changing Your Password:**

1. Log into the system
2. Click **"Change Password"** (top right, next to Log Out)
3. Enter:
   - Current password
   - New password
   - Confirm new password
4. Click **"Change"** to save

**Forgot Password:**
1. Click "Forgot Password" on login page
2. Enter your User ID
3. Check email within 15 minutes for reset link
4. Follow link to create new password`,
    keywords: ['change', 'password', 'reset', 'forgot', 'update'],
    category: 'general'
  },
  {
    id: 'g-4',
    question: 'What user roles are available?',
    answer: `**User Roles & Permissions:**

| Role | Description |
|------|-------------|
| **Supplier** | Create styles, submit for approval |
| **Lab** | Receive samples, upload test results |
| **Sainsburys** | Review and approve submissions |
| **SGS/ITS Implant** | Embedded lab staff at retailer |

**Special Permissions:**
- \`FabricTech=1\`: Can approve fabric components
- \`GarmentTech=1\`: Can approve styles, award Golden Tick
- \`Special\`: Admin permissions for system config`,
    keywords: ['role', 'user', 'permission', 'access', 'level'],
    category: 'general'
  },
  {
    id: 'g-5',
    question: 'Why can\'t I edit my style?',
    answer: `**Style Editing Restrictions:**

You cannot edit a style when:
- **Status is not PENDING:** Only PENDING styles can be edited
- **Status is SUBMITTED:** Waiting for buyer review
- **Status is APPROVED:** Approved styles are locked

**To Edit an Approved Style:**
Contact your technologist to "Undo" the approval, which returns status to PENDING.

**Key Rule:** Buyers cannot edit products regardless of status - only approve/reject/return.`,
    keywords: ['edit', 'cannot', 'locked', 'why', 'style', 'pending'],
    category: 'general'
  },
  {
    id: 'g-6',
    question: 'What is named routing?',
    answer: `**Named Routing:**

Tasks route directly to **specific, named individuals** (e.g., "Sarah Chen - Fabric Tech"), NOT to general team queues.

**Why?**
- Ensures accountability
- If a style is delayed, management knows WHO is responsible
- Faster resolution than general queues

**When Creating a Style:**
You MUST select specific named technologists for:
- Fabric Technologist
- Garment Technologist

This is NOT optional - the system enforces named routing.`,
    keywords: ['routing', 'named', 'technologist', 'assignment', 'queue'],
    category: 'general'
  }
];

// ============================================
// CONTEXT-SPECIFIC HELP PER ROUTE
// ============================================

export const contextualHelp: Record<string, ContextualHelp> = {
  '/': {
    route: '/',
    title: 'Dashboard',
    description: 'Your central hub for monitoring testing activity and key metrics.',
    commonQuestions: helpDatabase.filter(h => ['gs-3', 'gs-4', 't-7'].includes(h.id)),
    tips: [
      'Your inbox shows tasks awaiting your action',
      'Click on any metric card to see detailed breakdowns',
      'The schedule widget shows upcoming deadlines'
    ]
  },
  '/tests': {
    route: '/tests',
    title: 'Test Requests (TRFs)',
    description: 'Manage all your testing requests from creation to completion.',
    commonQuestions: helpDatabase.filter(h => h.category === 'testing'),
    tips: [
      'Use filters to quickly find specific TRFs',
      'Toggle between Table and Kanban views',
      'TRFs are locked after submission to lab',
      'Bulk testing requires each color separately'
    ]
  },
  '/inspections': {
    route: '/inspections',
    title: 'Inspections',
    description: 'Schedule and track factory inspections across your supply chain.',
    commonQuestions: helpDatabase.filter(h => h.category === 'inspections'),
    tips: [
      'Drag cards between columns in Kanban view',
      'Click a factory name to see all its inspections',
      'Risk levels are color-coded for quick scanning',
      'Reschedule at least 48 hours in advance'
    ]
  },
  '/suppliers': {
    route: '/suppliers',
    title: 'Supplier Management',
    description: 'View and manage your supplier network and performance.',
    commonQuestions: helpDatabase.filter(h => h.category === 'suppliers'),
    tips: [
      'Star suppliers to add them to favorites',
      'Check self-approval status in supplier details',
      'Performance charts update in real-time',
      'Compliance badges show certification status'
    ]
  },
  '/styles': {
    route: '/styles',
    title: 'Styles & Products',
    description: 'Manage your product catalog and track development stages.',
    commonQuestions: helpDatabase.filter(h => h.category === 'styles'),
    tips: [
      'Each style card shows current development stage',
      'Link components before submitting for testing',
      'Submit to your named technologist for review',
      'Stage progression: Base → Bulk → Approved'
    ]
  },
  '/components': {
    route: '/components',
    title: 'Components',
    description: 'Manage materials and components used across your products.',
    commonQuestions: helpDatabase.filter(h => h.category === 'components'),
    tips: [
      'Components can be linked to multiple styles (N:M)',
      'Base approval is valid for 6 months',
      'Reuse approved components to prevent overtesting',
      'Fiber composition must total 100%'
    ]
  },
  '/analytics': {
    route: '/analytics',
    title: 'Insights & Analytics',
    description: 'Analyze trends and generate reports from your quality data.',
    commonQuestions: helpDatabase.filter(h => h.category === 'reports'),
    tips: [
      'Use date range filters for trend analysis',
      'Compare performance across suppliers',
      'Export charts as images for presentations'
    ]
  },
  '/risk-assessment': {
    route: '/risk-assessment',
    title: 'Risk Assessment',
    description: 'Visualize supply chain risks on an interactive global map.',
    commonQuestions: helpDatabase.filter(h => ['s-1', 's-4'].includes(h.id)),
    tips: [
      'Click map markers to see factory details',
      'Color indicates risk level',
      'Toggle between map styles for different views'
    ]
  },
  '/settings': {
    route: '/settings',
    title: 'Settings',
    description: 'Configure your account and application preferences.',
    commonQuestions: helpDatabase.filter(h => h.category === 'general'),
    tips: [
      'Changes are saved automatically',
      'Check your self-approval permissions here',
      'Contact support for enterprise features'
    ]
  },
  '/help': {
    route: '/help',
    title: 'Knowledge Hub',
    description: 'Search our documentation, guides, and resources.',
    commonQuestions: helpDatabase.filter(h => ['gs-1', 'gs-3', 'g-4'].includes(h.id)),
    tips: [
      'Use the search bar for quick answers',
      'Browse by topic category',
      'Ask AI for complex questions'
    ]
  }
};

// ============================================
// ELEMENT-SPECIFIC HELP
// ============================================

export const elementHelp: ElementHelp[] = [
  // Header elements
  {
    selector: '[data-help="new-test-btn"]',
    title: 'Create New Test Request',
    description: 'Start a new TRF to request testing for a component. You\'ll need to specify the testing level (Base/Bulk/Garment).',
    learnMoreId: 't-1'
  },
  {
    selector: '[data-help="search-input"]',
    title: 'Global Search',
    description: 'Search across tests, inspections, suppliers, and styles. Use keywords like "TRF-2026" or supplier names.',
  },
  {
    selector: '[data-help="notifications"]',
    title: 'Notifications',
    description: 'View alerts for test completions, inspection results, and SLA warnings. Tasks in your inbox appear here.',
    learnMoreId: 'g-1'
  },
  
  // TRF elements
  {
    selector: '[data-help="trf-status"]',
    title: 'TRF Status',
    description: 'Current workflow stage: Draft → Submitted → In Testing → Pending Review → Approved/Rejected.',
    learnMoreId: 't-7'
  },
  {
    selector: '[data-help="testing-level"]',
    title: 'Testing Level',
    description: 'Base (initial), Bulk (production batch), or Garment (finished product). Each has different requirements.',
    learnMoreId: 't-2'
  },
  {
    selector: '[data-help="sla-indicator"]',
    title: 'SLA Status',
    description: 'Time remaining until deadline. Green = on track, Yellow = at risk (<24h), Red = overdue.',
    learnMoreId: 't-8'
  },
  {
    selector: '[data-help="priority-badge"]',
    title: 'Priority Level',
    description: 'Standard follows normal SLAs. Rush orders have 50% reduced timelines but may incur additional fees.',
    learnMoreId: 't-8'
  },
  
  // Style elements
  {
    selector: '[data-help="style-status"]',
    title: 'Style Status',
    description: 'PENDING = editing, SUBMITTED = under review, APPROVED = ready for production.',
    learnMoreId: 'st-2'
  },
  {
    selector: '[data-help="style-stage"]',
    title: 'Style Stage',
    description: 'Development stage: Base → Base Approved → Bulk → Bulk Approved → Final Approval.',
    learnMoreId: 'st-3'
  },
  
  // Supplier elements
  {
    selector: '[data-help="supplier-score"]',
    title: 'Supplier Score',
    description: 'Overall performance rating based on test results (40%), inspections (30%), delivery (20%), compliance (10%).',
    learnMoreId: 's-1'
  },
  {
    selector: '[data-help="compliance-badge"]',
    title: 'Compliance Status',
    description: 'Green = current, Yellow = expiring within 30 days, Red = expired or missing certifications.',
    learnMoreId: 's-4'
  },
  {
    selector: '[data-help="risk-level"]',
    title: 'Risk Level',
    description: 'Calculated risk score. Low (80-100), Medium (50-79), High (<50).',
    learnMoreId: 's-1'
  },
  {
    selector: '[data-help="self-approval"]',
    title: 'Self-Approval Status',
    description: 'Indicates if this supplier can approve their own submissions without retailer review.',
    learnMoreId: 's-2'
  },
  
  // Component elements
  {
    selector: '[data-help="component-validity"]',
    title: 'Base Test Validity',
    description: 'Base approvals are valid for 6 months. After expiry, retesting is required.',
    learnMoreId: 'cp-4'
  },
  
  // Inspection elements
  {
    selector: '[data-help="inspection-type"]',
    title: 'Inspection Type',
    description: 'Pre-Production, During Production, Final Random, or Full Inspection. Each has specific AQL standards.',
    learnMoreId: 'i-1'
  },
  {
    selector: '[data-help="inspection-result"]',
    title: 'Inspection Result',
    description: 'Pass/Fail/Pending based on defect findings against AQL criteria.',
    learnMoreId: 'i-1'
  }
];

// ============================================
// SEARCH & HELPER FUNCTIONS
// ============================================

export function searchHelp(query: string): HelpItem[] {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  return helpDatabase
    .map(item => {
      let score = 0;
      
      // Check keywords (highest weight)
      for (const keyword of item.keywords) {
        if (words.some(w => keyword.includes(w) || w.includes(keyword))) {
          score += 3;
        }
      }
      
      // Exact phrase match in question
      if (item.question.toLowerCase().includes(queryLower)) {
        score += 5;
      }
      
      // Word matches in question
      for (const word of words) {
        if (item.question.toLowerCase().includes(word)) {
          score += 2;
        }
      }
      
      // Check answer text
      if (item.answer.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ item }) => item);
}

export function getContextHelp(pathname: string): ContextualHelp | null {
  if (contextualHelp[pathname]) {
    return contextualHelp[pathname];
  }
  
  const baseRoute = '/' + pathname.split('/')[1];
  return contextualHelp[baseRoute] || contextualHelp['/'];
}

export function getElementHelp(selector: string): ElementHelp | null {
  return elementHelp.find(h => h.selector === selector) || null;
}

export function getHelpById(id: string): HelpItem | null {
  return helpDatabase.find(h => h.id === id) || null;
}
